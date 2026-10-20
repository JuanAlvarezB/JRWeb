# Guía para pasar a PDN

Paso a paso para publicar en producción (<https://conducirjrdelsinu.pages.dev>) lo que ya está en QA: revisión de QA, PR `qa` → `main`, aprobación del despliegue y verificación del sitio público. Sirve para la primera publicación y para las siguientes; las diferencias de la primera están marcadas con **Primera vez**.

Haz las partes en orden y no pases a la siguiente sin cerrar la anterior. Tiempo total: alrededor de 1 hora y 15 minutos, la mayor parte en la revisión de QA.

| Parte | Qué                        | Dónde                    | Tiempo    |
| ----- | -------------------------- | ------------------------ | --------- |
| 0     | Comprobaciones previas     | GitHub                   | 5 min     |
| 1     | Revisar QA a mano          | QA, computador y celular | 30–45 min |
| 2     | Abrir el PR `qa` → `main`  | GitHub                   | 5 min     |
| 3     | Esperar el CI              | GitHub                   | 6–8 min   |
| 4     | Integrar                   | GitHub                   | 1 min     |
| 5     | Aprobar el despliegue      | GitHub Actions           | 5 min     |
| 6     | Verificar el sitio público | PDN, Facebook y WhatsApp | 15 min    |
| 7     | Después de publicar        | Tu equipo                | 5 min     |

## Parte 0. Comprobaciones previas

1. **Secrets de producción.** En GitHub → **Settings** → **Environments** → **production**, confirma:
   - **Secrets:** `CLOUDFLARE_API_TOKEN` y `CLOUDFLARE_ACCOUNT_ID`.
   - **Variable** `VITE_CF_ANALYTICS_TOKEN` (opcional). Sin ella, PDN se publica sin analítica y se puede agregar después ([configuracion-cloudflare.md](configuracion-cloudflare.md), paso 8).
   - **Required reviewers:** tú, con **Prevent self-review** desactivado.
   - **Deployment branches:** solo `main`.

   **Primera vez:** revísalo con cuidado. En las siguientes publicaciones ya no cambia.

2. **QA en verde.** En **Actions** → **Despliegue a QA**, la última ejecución (la del último commit de `qa`) está en verde ✅, con `deploy-qa` y `regression-qa`.
3. **Nada pendiente hacia `qa`.** En **Pull requests** no hay PR abiertos hacia `qa`. Si hay uno, intégralo (y espera el nuevo despliegue a QA) o ciérralo. Lo que revisas en QA debe ser exactamente lo que se publica.

## Parte 1. Revisar QA a mano

1. Abre [checklist-pruebas-manuales-qa.md](checklist-pruebas-manuales-qa.md) en VS Code (vista previa: **Cmd + Shift + V**).
2. Entra a <https://qa.conducirjrdelsinu.pages.dev> con tu correo autorizado: Cloudflare Access te envía un código.
3. Recorre el checklist en el computador. **Primera vez** o cambio de diseño: secciones 1 a 8 completas. Cambio de contenido: secciones 1, 2 y lo relacionado con el cambio.
4. Haz la **sección 5** en un celular real (WhatsApp, llamada, mapas y Waze abren las apps).
5. Si algo falla, **detente**: corrígelo con una rama `feature/*` → PR a `qa`, espera a que QA se actualice y repite solo lo afectado.
6. Confirma que los pendientes que bloquean la publicación estén resueltos ([pendientes.md](pendientes.md)). Para la primera publicación ya se cerraron la aprobación de Preguntas frecuentes (#2) y la revisión en celulares (#3); las fotos (#1) quedaron fuera por decisión del dueño.
7. Copia el checklist con tus marcas `[x]` en un archivo de texto: lo pegarás en el PR.

> La vista previa al compartir **no** se revisa en QA: QA está protegido y WhatsApp solo vería "Sign in · Cloudflare Access". Eso es correcto; se revisa en PDN (parte 6).

## Parte 2. Abrir el PR `qa` → `main`

1. En GitHub: **Pull requests** → **New pull request**.
2. Arriba elige **base: `main`** ← **compare: `qa`**. Revisa la dirección: la base es `main`.
3. Debe decir **"Able to merge"** y listar los commits nuevos. Pulsa **Create pull request**.
4. **Título:** los `AB#` de las tareas incluidas (por ejemplo, `AB#01 AB#2`). Solo `AB#`, no "Fixes AB#".
5. Completa la plantilla:
   - **Qué cambia:** una o dos frases. **Primera vez:** "Primera publicación del sitio en PDN (release 1): 8 páginas, SEO, vistas previas al compartir, despliegue y documentación."
   - **Trabajo en Azure Boards:** los mismos `AB#`.
   - **Tipo de PR:** marca **`qa` → `main` (paso a PDN)**.
   - **Antes de pedir la integración:** marca los puntos que apliquen.
   - **Solo para `qa` → `main`:** marca los dos puntos.
6. Pulsa **Create pull request**.
7. Agrega un **comentario** en el PR con el checklist marcado de la parte 1.

## Parte 3. Esperar el CI

1. Abajo del PR aparecen **10 verificaciones**. En este PR la build es de **producción** y aparece `source-branch-check`, que confirma que el origen es `qa`.
2. Espera a que todas estén en verde ✅ y a que el comentario de resumen diga **"CI en verde · build `production`"**.
3. Si una falla, **no integres**. Revisa el detalle (**Details**) y corrige con un PR a `qa`; este PR se actualiza solo cuando `qa` cambia.

| Si falla…                    | Causa probable                                                                                      |
| ---------------------------- | --------------------------------------------------------------------------------------------------- |
| `content-validation`         | Hacia `main`, la política de datos debe estar aprobada (`status: approved`)                         |
| `source-branch-check`        | El PR no sale de `qa`. Ciérralo y ábrelo desde `qa`                                                 |
| `visual-tests`               | Una diferencia visual: revisa el artefacto de diferencias del CI                                    |
| "This branch is out-of-date" | `qa` no tiene el último commit de `main` ([configuracion-github.md](configuracion-github.md), 10.2) |

## Parte 4. Integrar

1. En el botón verde de abajo, abre la flecha ▾ y elige **Create a merge commit**. **No** uses "Squash" ni "Rebase": así `qa` y `main` conservan la misma historia.
2. **Merge pull request** → **Confirm merge**.
3. Si GitHub ofrece borrar la rama `qa`, **no la borres**: es permanente.

## Parte 5. Aprobar el despliegue

1. Ve a **Actions** → **Despliegue a PDN**. La ejecución nueva aparece en amarillo, **"Waiting"**.
2. Ábrela → **Review deployments** → marca **production** → (opcional) escribe un comentario → **Approve and deploy**.
3. Corren dos jobs, uno después del otro:
   - **`deploy-production`**: build de producción (indexable, con `sitemap.xml` y analítica si hay token) y publicación en Cloudflare Pages. 2–3 minutos.
   - **`smoke-production`**: espera a que PDN responda y prueba el titular, WhatsApp, la ubicación, `robots.txt`, `sitemap.xml`, la 404 y la imagen para compartir.
4. Los dos quedan en verde ✅. El **resumen** de la ejecución muestra la URL y el resultado del smoke.

### Si algo falla

- **Falla `deploy-production`:** el sitio **no** se publicó. Lee el error; lo más común es un secret faltante (el mensaje lo dice). Corrígelo en el environment `production` y pulsa **Re-run failed jobs**. No hace falta otro PR.
- **Falla `smoke-production`:** el sitio **sí** se publicó, pero algo no está bien.
  - **Primera vez:** no hay una versión anterior a la cual revertir. Como nadie conoce aún la URL, no hay prisa: no la compartas y corrige con el flujo normal (rama `feature/*` → `qa` → `main`).
  - **Siguientes veces:** revierte en Cloudflare: **Workers & Pages** → `conducirjrdelsinu` → **Deployments** → el despliegue anterior de **Production** → **⋯** → **Rollback to this deployment**. PDN vuelve a esa versión en segundos. Después corrige con el flujo normal ([configuracion-cloudflare.md](configuracion-cloudflare.md), "Revertir una publicación").

## Parte 6. Verificar el sitio público

1. Abre <https://conducirjrdelsinu.pages.dev> en una ventana de incógnito:
   - [ ] Carga sin pedir correo.
   - [ ] **No** tiene la etiqueta "QA".
   - [ ] El cambio publicado se ve como en QA.
2. Abre <https://conducirjrdelsinu.pages.dev/robots.txt>:
   - [ ] Dice `Allow: /` y la línea `Sitemap: https://conducirjrdelsinu.pages.dev/sitemap.xml`.
3. Abre <https://conducirjrdelsinu.pages.dev/sitemap.xml>:
   - [ ] Lista las 7 páginas (todas menos la 404).
4. **Vistas previas al compartir** (sección 9 del checklist):
   1. Abre <https://developers.facebook.com/tools/debug/>, pega `https://conducirjrdelsinu.pages.dev/` y pulsa **Debug**. Si la página ya se había compartido antes, pulsa **Scrape Again**.
      - [ ] Response Code 200.
      - [ ] La imagen con el logo sobre fondo blanco, el título y la descripción completa.
   2. Repite con `/planes`, `/contactanos` y `/preguntas-frecuentes`.
   3. Envía el enlace de Inicio y el de Planes a un chat de prueba de WhatsApp (por ejemplo, el tuyo):
      - [ ] Cada uno muestra la imagen, el título y la descripción sin cortes.
5. **Solo cuando todo lo anterior esté bien, comparte el enlace con clientes.** WhatsApp guarda la primera vista previa de cada enlace en caché varios días.

## Parte 7. Después de publicar

1. Actualiza tu copia local:

   ```bash
   git switch qa && git pull origin qa
   ```

   Desde ahora `main` tiene un merge commit que `qa` no tiene. Por eso cada rama nueva sigue el flujo de siempre: sale de `qa` y ejecuta `git pull --no-rebase origin main` ([configuracion-github.md](configuracion-github.md), paso 9).

2. Actualiza [estado-del-proyecto.md](estado-del-proyecto.md) y [pendientes.md](pendientes.md) con una rama `feature/*` (qué se publicó, la fecha y los pendientes resueltos).
3. **Primera vez:** registra el sitio en Google Search Console (pendiente #6): verifica la propiedad, envía `https://conducirjrdelsinu.pages.dev/sitemap.xml` y revisa los resultados enriquecidos (escuela y preguntas frecuentes).

## Resumen rápido (para las siguientes publicaciones)

1. QA en verde y sin PR abiertos hacia `qa`.
2. Checklist de QA (corto o completo según el cambio).
3. PR `qa` → `main` con los `AB#` y el checklist en un comentario.
4. CI en verde → **Create a merge commit**.
5. **Actions** → **Despliegue a PDN** → **Approve and deploy**.
6. `deploy-production` y `smoke-production` en verde.
7. Revisar PDN; si cambiaron textos o imagen para compartir, **Scrape Again** y prueba en WhatsApp.
8. `git switch qa && git pull origin qa`.
