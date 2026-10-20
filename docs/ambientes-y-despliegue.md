# Ambientes, pipeline y despliegue

Cómo llega un cambio de tu equipo (DEV) a QA y a PDN. La configuración de GitHub está en [`configuracion-github.md`](configuracion-github.md).

| Ambiente | Dónde vive                       | Rama        | Visibilidad                 |
| -------- | -------------------------------- | ----------- | --------------------------- |
| DEV      | Tu equipo (`npm run dev`)        | `feature/*` | Solo tú                     |
| QA       | `qa.conducirjrdelsinu.pages.dev` | `qa`        | Privado (Cloudflare Access) |
| PDN      | `conducirjrdelsinu.pages.dev`    | `main`      | Público                     |

## 1. Pipeline de validación (`.github/workflows/ci.yml`)

Se ejecuta en **cada PR hacia `qa` o `main`**. Cada job tiene un nombre fijo porque los rulesets lo exigen.

| #   | Job                   | Qué verifica                                                                                                                                          | Equivalente en tu equipo                             |
| --- | --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| 0   | `source-branch-check` | Hacia `main` solo puede venir `qa`. Hacia `qa` avisa (sin bloquear) si la rama no trae el último `main`.                                              | —                                                    |
| 1   | `lint`                | Tokens sin editar a mano, ESLint (incluye reglas de arquitectura), Stylelint y Prettier                                                               | `npm run lint`                                       |
| 2   | `typecheck`           | TypeScript estricto en app, scripts y pruebas                                                                                                         | `npm run typecheck`                                  |
| 3   | `content-validation`  | Ningún precio en el contenido; política de datos aprobada y con analítica (obligatorio hacia `main`)                                                  | `npm run content:validate`                           |
| 4   | `secret-scan`         | gitleaks sobre todo el historial                                                                                                                      | `gitleaks git .` (opcional: `brew install gitleaks`) |
| 5   | `unit-tests`          | Vitest con cobertura mínima por capa: dominio, datos, formateadores y SEO                                                                             | `npm run test:unit`                                  |
| 6   | `component-tests`     | React Testing Library                                                                                                                                 | `npm run test:components`                            |
| 7   | `build`               | Build del ambiente destino: `qa` en PR hacia `qa`, `production` hacia `main`                                                                          | `npm run build:qa`                                   |
| 8   | `e2e-tests`           | Playwright en Chromium, Firefox, WebKit y móvil, contra la build del paso 7 servida como Cloudflare Pages: accesibilidad (axe), SEO del HTML y flujos | `npm run test:e2e`                                   |
| 9   | `visual-tests`        | Capturas de cada página contra las de referencia                                                                                                      | `npm run test:visual`                                |

Los jobs 0 a 6 corren en paralelo; `build` espera a todos; `e2e-tests` y `visual-tests` esperan a `build`. Si cualquiera falla, el PR no se puede integrar (cuando los rulesets estén en fase 2).

### Qué prueba cada suite

| Suite            | Dónde                         | Qué cubre                                                                                                                                                                                                                                       |
| ---------------- | ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Unitarias        | `tests/unit/`                 | Reglas del dominio, esquemas y coherencia del contenido, formateadores, SEO y datos estructurados, scripts de build y servidor local                                                                                                            |
| Componentes      | `tests/components/`           | Hooks, features, páginas y layout con el contenido real: menú móvil, aviso de privacidad, Error Boundary, caché del prerender                                                                                                                   |
| E2E de regresión | `tests/e2e/specs/regression/` | Cada página: un H1, sin errores de consola, axe WCAG AA y SEO del HTML. Flujos: navegación y foco, WhatsApp con su mensaje por plan, "Tu curso en horas" (mouse y teclado), menú móvil, aviso de privacidad, contacto, mapa, anclas y preguntas |
| Visual           | `tests/e2e/specs/visual/`     | Cada página completa a 1440 y 390 px contra su captura de referencia                                                                                                                                                                            |
| Smoke de PDN     | `tests/e2e/specs/smoke/`      | Después de publicar: titular, WhatsApp, ubicación, indexación (robots, sitemap) y 404                                                                                                                                                           |

Los Page Objects de cada página están en `tests/e2e/pages/` y se usan como fixtures (`home`, `plans`, `contact`, `faq`, `policy`).

### Leer los resultados

- **En el PR:** el job `resumen` publica (y actualiza) un comentario con el estado de cada verificación.
- **En la ejecución** (pestaña **Actions** → la ejecución → **Summary**): cobertura y, abajo, **Artifacts**:
  - `cobertura`: reporte HTML de cobertura (abre `index.html`).
  - `reporte-e2e`: reporte HTML de Playwright.
  - `fallos-e2e`: trazas, capturas y video, **solo si algo falló**. Ábrelas con `npx playwright show-trace <archivo>.zip`.
  - `diferencias-visuales`: comparación esperada / actual / diferencia, solo si falla la regresión visual.
- Las acciones están fijadas por commit (SHA) y Dependabot propone sus actualizaciones.

### Antes de abrir un PR

```bash
npm test     # unitarias + componentes + build de QA + e2e + visuales
```

La primera vez instala los navegadores de Playwright: `npx playwright install`.

## 2. Capturas de referencia (regresión visual)

Las capturas dependen del sistema operativo, así que **las de referencia se generan en Linux**, igual que en el CI:

1. Sube tu rama `feature/*`.
2. En GitHub: **Actions** → **Actualizar capturas de referencia** → **Run workflow** → elige tu rama → **Run workflow**.
3. Al terminar, descarga el artefacto `capturas-de-referencia` y descomprímelo en `tests/e2e/specs/visual/`.
4. Revisa las imágenes, haz commit y push. En el PR, GitHub muestra las capturas nuevas para revisarlas.

Solo se actualizan cuando el cambio de diseño o de contenido es intencional. Mientras una rama no tenga sus capturas de Linux, el job `visual-tests` falla con "A snapshot doesn't exist": es la señal para ejecutar este workflow.

## 3. Despliegue a QA y PDN

La configuración inicial de Cloudflare y GitHub está en [`configuracion-cloudflare.md`](configuracion-cloudflare.md). Los dos despliegues usan `deploy-reusable.yml`: build del ambiente (con prerender) y publicación con Wrangler en Cloudflare Pages.

### Llevar un cambio de DEV a QA

1. Trabaja en una rama `feature/*` creada desde `qa` (flujo en [`configuracion-github.md`](configuracion-github.md), paso 9).
2. Antes del PR, en tu equipo: `npm test` y, para ver la versión de QA, `npm run preview:qa`.
3. Abre el PR hacia `qa` y espera las 9 verificaciones del CI.
4. Integra con **Create a merge commit**. Se ejecuta **Despliegue a QA** (`deploy-qa.yml`):
   - `deploy-qa`: build de QA → rama `qa` de Cloudflare Pages → <https://qa.conducirjrdelsinu.pages.dev> (con Cloudflare Access).
   - `regression-qa`: la regresión de Playwright (4 navegadores) contra QA, con el Service Token.
5. Revisa QA a mano con el [checklist de QA](checklist-pruebas-manuales-qa.md) (entra con tu correo y el código que llega).
6. Si `regression-qa` falla, GitHub te avisa y el resumen de la ejecución lo marca. **No abras el PR hacia `main`** hasta corregirlo con otro PR a `qa`.

**Plan de respaldo** (`QA_REMOTE_DEPLOY` = `false`): `deploy-qa` se omite. `regression-qa` construye la versión de QA y la prueba dentro de GitHub Actions. Las pruebas manuales se hacen con `npm run preview:qa`.

### Llevar QA a PDN

Paso a paso detallado, con pantallas y qué hacer si algo falla: [`guia-paso-a-pdn.md`](guia-paso-a-pdn.md).

1. Con QA en verde y el [checklist](checklist-pruebas-manuales-qa.md) completo, abre el PR **`qa` → `main`** (solo `qa` puede llegar a `main`). El CI corre las 10 verificaciones con la build de producción.
2. Integra con **Create a merge commit**. Se ejecuta **Despliegue a PDN** (`deploy-prod.yml`), que **espera tu aprobación**: **Review deployments** → `production` → **Approve and deploy**.
3. `deploy-production`: build de producción (indexable, con sitemap y analítica) → rama `main` de Cloudflare Pages → <https://conducirjrdelsinu.pages.dev>.
4. `smoke-production`: titular, WhatsApp, ubicación, robots, sitemap y 404 contra PDN.
5. Si el smoke falla: **revierte desde Cloudflare** ([`configuracion-cloudflare.md`](configuracion-cloudflare.md), "Revertir una publicación") y corrige con el flujo normal.

### Qué cambia en cada ambiente

| Ambiente | Build        | Indexación                            | Analítica         | Etiqueta | Acceso                       |
| -------- | ------------ | ------------------------------------- | ----------------- | -------- | ---------------------------- |
| DEV      | `dev`        | —                                     | No                | No       | Tu equipo                    |
| QA       | `qa`         | `noindex` (robots, encabezado y HTML) | No                | "QA"     | Correos autorizados (Access) |
| PDN      | `production` | Sí, con `sitemap.xml`                 | Sí (si hay token) | No       | Público                      |

Las ejecuciones de despliegue también se pueden lanzar a mano: **Actions** → el workflow → **Run workflow**, sobre `qa` o `main`.
