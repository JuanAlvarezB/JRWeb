# Estado del proyecto

Sitio web de Conducir J&R del Sinú: etapas terminadas y etapas que faltan.

Actualizado el 17 oct 2026, al cerrar la etapa de páginas.

## Resumen

- **Hecho:** el sitio funciona completo en DEV. Tiene las 8 páginas con contenido real y cumple DESIGN.md y los mockups. El CI de GitHub valida cada PR hacia `qa`.
- **Falta para publicar:**
  - SEO y prerender.
  - Ampliar las pruebas.
  - Desplegar en Cloudflare Pages (QA privado y PDN).
  - Llevar `qa` a `main`.

| Rama   | Estado                                                             |
| ------ | ------------------------------------------------------------------ |
| `qa`   | Etapas 1–9 integradas (la etapa 9, páginas, al aprobarse su PR).   |
| `main` | Solo el primer commit. Ninguna etapa ha pasado a PDN.              |
| Sitio  | Aún no está publicado: el despliegue en Cloudflare es la etapa 12. |

## Etapas terminadas

| #   | Etapa                        | Qué quedó                                                                                                                                | PR              |
| --- | ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| 1   | Entorno local (DEV)          | React 19 + Vite 8 + TypeScript estricto, ESLint, Stylelint y Prettier. Variables de entorno validadas para DEV, QA y PDN.                | —               |
| 2   | Tokens, fuentes y estilos    | Style Dictionary genera `variables.css` desde `design-tokens/`. Barlow y Barlow Condensed autoalojadas. Stylelint solo acepta variables. | —               |
| 3   | Marca y componentes base     | Botones, links de acción, franja, encabezados, tarjetas, acordeón, velocímetro, aguada e íconos. Catálogo en `/dev/componentes`.         | —               |
| —   | Configuración de GitHub y CI | Rulesets de `qa` y `main`, Dependabot, plantilla de PR y CODEOWNERS. `ci.yml` con 10 verificaciones obligatorias.                        | #1              |
| 4   | Dominio                      | Entidades con sus reglas (NIT, horas, horarios…), contratos de repositorio y 10 casos de uso. Sin React ni librerías externas.           | #9              |
| 5   | Datos                        | Contenido real en JSON y Markdown, esquemas Zod estrictos, mappers, 9 repositorios y validación de coherencia entre archivos.            | #10             |
| 6   | DI y providers               | `di/container.ts` como composition root, `DependencyProvider` y `QueryProvider`. El README documenta cómo pasar a Supabase.              | #12             |
| 7   | Hooks                        | Hooks de datos con TanStack Query y Suspense, claves de consulta centralizadas y enlaces de contacto (WhatsApp, llamada, mapas).         | #13             |
| 8   | Features                     | Componentes de cada sección con datos reales, validados contra los mockups a 1440 y 390 px.                                              | #14             |
| 9   | Páginas                      | Detalle en la sección siguiente.                                                                                                         | Pendiente de PR |

Las etapas 1–3 entraron con el primer commit del repositorio, antes de adoptar el flujo de ramas `feature/*`.

### Detalle de la etapa 9 (páginas)

- **Las 8 páginas:** Inicio, Nosotros, Servicios, Planes, Contáctanos, Preguntas frecuentes, Política de datos y 404. Cada una se descarga por separado.
- **Layout:**
  - Menú fijo de 124 → 72 px y menú móvil.
  - Footer y botón flotante de WhatsApp.
  - Aviso de privacidad y etiqueta QA.
  - "Saltar al contenido".
  - Un Error Boundary por página.
- **Política de datos:** la página muestra el texto oficial aprobado con su índice.

## Etapas que faltan

| #   | Etapa                          | Alcance                                                                                                                                                                                                                                                                                                                                         |
| --- | ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 10  | SEO, prerender y analítica     | Prerender de cada ruta con `react-dom/static`, con las consultas precargadas y `404.html`. Título, descripción, canónica, Open Graph y JSON-LD (`DrivingSchool` / `LocalBusiness`) por página. `sitemap.xml` y `robots.txt` por ambiente. Cloudflare Web Analytics solo en PDN. Revisar el peso del JavaScript inicial (hoy 126 KB comprimido). |
| 11  | Pruebas                        | Page Objects por página. Flujos e2e: WhatsApp con mensaje, selector de horas, menú móvil, aviso de privacidad y anclas. Capturas de referencia por página (`test:visual`). Smoke de PDN con WhatsApp y ubicación.                                                                                                                               |
| 12  | Despliegue en Cloudflare Pages | `deploy-reusable.yml`, `deploy-qa.yml` (integración en `qa` → QA + regresión) y `deploy-prod.yml` (`main` → aprobación → PDN + smoke). Cloudflare Access para QA con Service Token para las pruebas. Secrets en los environments de GitHub. Fase 3 de los rulesets.                                                                             |
| 13  | Documentación                  | `configuracion-cloudflare.md`, `guia-actualizar-contenido.md` y `checklist-pruebas-manuales-qa.md`. Actualizar `ambientes-y-despliegue.md` y `configuracion-github.md` (regla de Dependabot sobre versiones mayores).                                                                                                                           |
| 14  | Paso a PDN                     | PR `qa` → `main` con todas las verificaciones, aprobación del despliegue y revisión del checklist en QA antes de publicar.                                                                                                                                                                                                                      |

## Decisiones pendientes del dueño

Ninguna bloquea el desarrollo. Conviene resolverlas antes del paso a PDN.

1. **Respuestas de Preguntas frecuentes:** cinco respuestas se redactaron como propuesta con datos reales (horas, horarios, días de práctica, requisitos y ubicación). Falta aprobarlas o ajustarlas en `src/data/content/faq.json`.
2. **Fotos reales** de la sede y los vehículos (opcional para el release 1). Al agregarlas al contenido, los bloques de Servicios pasan a dos columnas sin cambiar código.
3. **Revisión en QA:** cuando QA esté desplegado, revisar el sitio en un celular real (WhatsApp, llamada, mapa y Waze).

## Verificaciones al cierre de la etapa 9

| Verificación                                | Resultado                                            |
| ------------------------------------------- | ---------------------------------------------------- |
| Lint (ESLint, Stylelint, Prettier, tokens)  | Sin errores                                          |
| Tipos (`npm run typecheck`)                 | Sin errores                                          |
| Validación de contenido                     | Sin precios, esquemas y coherencia correctos         |
| Pruebas unitarias y de componentes (Vitest) | 205 pasan                                            |
| E2E (Chromium, Firefox, WebKit y móvil)     | 64 pasan; axe sin violaciones WCAG AA en las 8 rutas |
| gitleaks                                    | Sin hallazgos                                        |
