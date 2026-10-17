# Ambientes, pipeline y despliegue

Cómo llega un cambio de tu equipo (DEV) a QA y a PDN. La configuración de GitHub está en [`configuracion-github.md`](configuracion-github.md).

| Ambiente | Dónde vive                       | Rama        | Visibilidad                 |
| -------- | -------------------------------- | ----------- | --------------------------- |
| DEV      | Tu equipo (`npm run dev`)        | `feature/*` | Solo tú                     |
| QA       | `qa.conducirjrdelsinu.pages.dev` | `qa`        | Privado (Cloudflare Access) |
| PDN      | `conducirjrdelsinu.pages.dev`    | `main`      | Público                     |

## 1. Pipeline de validación (`.github/workflows/ci.yml`)

Se ejecuta en **cada PR hacia `qa` o `main`**. Cada job tiene un nombre fijo porque los rulesets lo exigen.

| #   | Job                   | Qué verifica                                                                                             | Equivalente en tu equipo                             |
| --- | --------------------- | -------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| 0   | `source-branch-check` | Hacia `main` solo puede venir `qa`. Hacia `qa` avisa (sin bloquear) si la rama no trae el último `main`. | —                                                    |
| 1   | `lint`                | Tokens sin editar a mano, ESLint (incluye reglas de arquitectura), Stylelint y Prettier                  | `npm run lint`                                       |
| 2   | `typecheck`           | TypeScript estricto en app, scripts y pruebas                                                            | `npm run typecheck`                                  |
| 3   | `content-validation`  | Ningún precio en el contenido; política de datos aprobada y con analítica (obligatorio hacia `main`)     | `npm run content:validate`                           |
| 4   | `secret-scan`         | gitleaks sobre todo el historial                                                                         | `gitleaks git .` (opcional: `brew install gitleaks`) |
| 5   | `unit-tests`          | Vitest con cobertura (dominio ≥ 80 %)                                                                    | `npm run test:unit`                                  |
| 6   | `component-tests`     | React Testing Library                                                                                    | `npm run test:components`                            |
| 7   | `build`               | Build del ambiente destino: `qa` en PR hacia `qa`, `production` hacia `main`                             | `npm run build:qa`                                   |
| 8   | `e2e-tests`           | Playwright + axe en Chromium, Firefox, WebKit y móvil, contra la build del paso 7                        | `npm run test:e2e`                                   |
| 9   | `visual-tests`        | Capturas de cada página contra las de referencia                                                         | `npm run test:visual`                                |

Los jobs 0 a 6 corren en paralelo; `build` espera a todos; `e2e-tests` y `visual-tests` esperan a `build`. Si cualquiera falla, el PR no se puede integrar (cuando los rulesets estén en fase 2).

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

Solo se actualizan cuando el cambio de diseño es intencional.

## 3. Despliegue a QA y PDN

Se completa en la etapa de Cloudflare (`deploy-qa.yml`, `deploy-prod.yml` y `deploy-reusable.yml`).
