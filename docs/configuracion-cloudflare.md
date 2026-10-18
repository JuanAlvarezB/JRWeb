# Configuración de Cloudflare

Paso a paso para publicar el sitio en **Cloudflare Pages** (plan gratuito):

- **QA privado:** `qa.conducirjrdelsinu.pages.dev`, protegido con **Cloudflare Access**.
- **PDN público:** `conducirjrdelsinu.pages.dev`, con **Cloudflare Web Analytics**.

GitHub Actions hace los despliegues ([`ambientes-y-despliegue.md`](ambientes-y-despliegue.md)). Cloudflare no se conecta al repositorio.

> **Regla de oro:** tokens, IDs, secretos y correos autorizados **nunca** se escriben en el repositorio, en la documentación ni en un PR. Solo van en Cloudflare y en los environments de GitHub. El repositorio es público.

## Resumen

| #   | Paso                                        | Dónde                     | Resultado                                                 |
| --- | ------------------------------------------- | ------------------------- | --------------------------------------------------------- |
| 1   | Cuenta y Account ID                         | Cloudflare                | `CLOUDFLARE_ACCOUNT_ID`                                   |
| 2   | Crear el proyecto de Pages                  | Terminal o Cloudflare     | Proyecto `conducirjrdelsinu` (rama de producción `main`) |
| 3   | Token de API (solo Pages)                   | Cloudflare                | `CLOUDFLARE_API_TOKEN`                                    |
| 4   | Secrets y variables                         | GitHub                    | Environments `qa` y `production` listos                   |
| 5   | Proteger QA con Cloudflare Access           | Cloudflare (Zero Trust)   | QA solo para los correos autorizados                      |
| 6   | Service Token para las pruebas              | Cloudflare (Zero Trust)   | `CF_ACCESS_CLIENT_ID` y `CF_ACCESS_CLIENT_SECRET`         |
| 7   | Primer despliegue a QA                      | GitHub Actions            | QA publicado y regresión en verde                         |
| 8   | Web Analytics                               | Cloudflare                | `VITE_CF_ANALYTICS_TOKEN`                                 |
| 9   | Primer despliegue a PDN                     | GitHub (PR `qa` → `main`) | Sitio público y smoke en verde                            |

Los menús de Cloudflare cambian de nombre con el tiempo. Si una opción no aparece tal cual, búscala con el buscador del panel; el nombre de la función se mantiene.

---

## 1. Cuenta y Account ID

1. Crea la cuenta gratuita en <https://dash.cloudflare.com/sign-up> (o entra con la existente).
2. Activa la verificación en dos pasos: **My Profile** → **Authentication** → **Two-factor authentication**.
3. Copia el **Account ID**: en el panel, **Workers & Pages** → columna derecha → **Account ID** → copiar.

Guárdalo para el paso 4.

## 2. Crear el proyecto de Pages

El proyecto se crea **sin conectarlo a GitHub** (Direct Upload): los despliegues los hace el pipeline, que primero valida todo.

**Opción A, terminal (recomendada):**

```bash
npx wrangler@4.147.0 login                                   # abre el navegador para autorizar
npx wrangler@4.147.0 pages project create conducirjrdelsinu --production-branch main
npx wrangler@4.147.0 logout                                  # opcional: cierra la sesión local
```

**Opción B, panel:** **Workers & Pages** → **Create** → pestaña **Pages** → **Upload assets** (no "Connect to Git") → nombre `conducirjrdelsinu` → **Create project**.

- Si te pide subir archivos, sube cualquier carpeta pequeña: el primer despliegue real la reemplaza.
- En **Settings** → **Builds & deployments**, confirma que la rama de producción sea `main`.

**Si el nombre no está disponible** (el panel lo avisa): elige el más cercano, por ejemplo `conducir-jr-del-sinu`, y avísame. El nombre está en la URL canónica, los `.env.*`, los scripts de prueba y los workflows; los actualizo todos en un PR. En GitHub, crea además la variable de repositorio `CF_PAGES_PROJECT` con el nombre nuevo.

> **¿Pages o Workers?** Cloudflare promueve Workers con assets estáticos para proyectos nuevos. Para este sitio, totalmente estático, Pages es más simple:
>
> - URL por rama (`qa.…pages.dev`);
> - protección de vistas previas con Access en un clic;
> - `_headers`, `_redirects` y `404.html` sin configuración.
>
> Workers solo convendría si en la fase 2 hiciera falta lógica en el servidor.

## 3. Token de API (solo Pages)

1. **My Profile** → **API Tokens** → **Create Token** → **Create Custom Token** → **Get started**.
2. Configúralo así:

   | Campo             | Valor                                                            |
   | ----------------- | ---------------------------------------------------------------- |
   | Token name        | `github-actions-pages`                                           |
   | Permissions       | **Account** · **Cloudflare Pages** · **Edit** (solo ese permiso) |
   | Account Resources | **Include** · tu cuenta                                          |
   | TTL               | Opcional (si pones fecha, anótala para renovarlo)                |

3. **Continue to summary** → **Create Token** → **copia el token** (solo se muestra una vez).

Ese token solo puede publicar en Pages: no toca DNS, ni dominios, ni otras partes de la cuenta.

## 4. Secrets y variables en GitHub

En **Settings** → **Environments** (creados en [`configuracion-github.md`](configuracion-github.md), paso 5):

| Environment  | Tipo     | Nombre                    | Valor                                |
| ------------ | -------- | ------------------------- | ------------------------------------ |
| `qa`         | Secret   | `CLOUDFLARE_API_TOKEN`    | Token del paso 3                     |
| `qa`         | Secret   | `CLOUDFLARE_ACCOUNT_ID`   | Account ID del paso 1                |
| `qa`         | Secret   | `CF_ACCESS_CLIENT_ID`     | Paso 6                               |
| `qa`         | Secret   | `CF_ACCESS_CLIENT_SECRET` | Paso 6                               |
| `production` | Secret   | `CLOUDFLARE_API_TOKEN`    | El mismo token del paso 3            |
| `production` | Secret   | `CLOUDFLARE_ACCOUNT_ID`   | Account ID del paso 1                |
| `production` | Variable | `VITE_CF_ANALYTICS_TOKEN` | Paso 8 (es público, por eso variable) |

Y en **Settings** → **Secrets and variables** → **Actions** → pestaña **Variables** → **New repository variable**:

| Variable           | Valor                                                                                            |
| ------------------ | ------------------------------------------------------------------------------------------------ |
| `QA_REMOTE_DEPLOY` | `true` cuando terminen los pasos 5 y 6. `false` = plan de respaldo (QA no se publica en internet) |
| `CF_PAGES_PROJECT` | Solo si el proyecto no se llama `conducirjrdelsinu`                                              |

## 5. Proteger QA con Cloudflare Access

QA es una **vista previa** del proyecto (rama `qa`). Cloudflare protege todas las vistas previas con un clic y deja la producción pública.

### 5.1 Activar Zero Trust (una sola vez)

1. En el panel: **Zero Trust**.
2. Elige un **team name** (por ejemplo, `conducirjrdelsinu`) y el plan **Free** (hasta 50 usuarios).
3. **Si Cloudflare exige un método de pago** y prefieres no agregarlo: deja `QA_REMOTE_DEPLOY` = `false` (plan de respaldo).
   - QA no se publica.
   - La regresión corre contra la build de QA en GitHub Actions.
   - Las pruebas manuales se hacen con `npm run preview:qa`.
   - Nada más cambia.

### 5.2 Activar la política en el proyecto

1. **Workers & Pages** → `conducirjrdelsinu` → **Settings** → **General** → **Access policy** → **Enable**.
2. Cloudflare crea una aplicación de Access para `*.conducirjrdelsinu.pages.dev`: QA y cada URL temporal de despliegue. La producción `conducirjrdelsinu.pages.dev` queda pública.

### 5.3 Autorizar los correos de administrador

1. **Zero Trust** → **Access** → **Applications** → la aplicación del proyecto → **Edit** → **Policies**.
2. Edita la política de tipo **Allow**:
   - **Include** → **Emails** → agrega **los dos correos de administrador acordados**. No los escribas en el repositorio.
   - Quita cualquier otra regla que deje entrar a más personas.
3. **Settings** → **Authentication**: deja activo **One-time PIN**. Al entrar a QA, Cloudflare envía un código al correo.

## 6. Service Token para las pruebas automatizadas

Las pruebas de GitHub Actions no pueden recibir un código por correo: entran con un Service Token.

1. **Zero Trust** → **Access** → **Service auth** → **Service Tokens** → **Create Service Token**.
2. Nombre: `github-actions-qa`. Duración: 1 año (anota la fecha de vencimiento).
3. **Copia el Client ID y el Client Secret** (el secret solo se muestra una vez) → guárdalos en el environment `qa` (paso 4).
4. En la aplicación de Access del proyecto → **Policies** → **Add a policy**:
   - Nombre: `Pruebas automatizadas`.
   - **Action: Service Auth**. Debe ser esta, no "Allow".
   - **Include** → **Service Token** → `github-actions-qa`.
   - **Save**.

## 7. Primer despliegue a QA

1. En GitHub, la variable `QA_REMOTE_DEPLOY` = `true`.
2. **Actions** → **Despliegue a QA** → **Run workflow** → rama `qa` → **Run workflow**. Desde entonces se ejecuta solo al integrar cada PR en `qa`.
3. Al terminar, ambos jobs deben quedar en verde:
   - `deploy-qa`: build y publicación.
   - `regression-qa`: las pruebas de Playwright contra QA, en 4 navegadores.
4. Abre <https://qa.conducirjrdelsinu.pages.dev>:
   - Cloudflare pide tu correo y te envía un código.
   - Debes ver el sitio con la etiqueta **QA** arriba a la izquierda.
5. En una ventana privada, sin iniciar sesión, la misma URL debe mostrar la pantalla de acceso de Cloudflare, no el sitio.

## 8. Cloudflare Web Analytics (solo PDN)

1. En el panel: **Analytics & Logs** → **Web Analytics** → **Add a site**.
2. Hostname: `conducirjrdelsinu.pages.dev`.
3. Elige la opción de **fragmento JavaScript manual**, no la automática.
   - El token es el valor de `"token"` dentro del fragmento. Cópialo en la variable `VITE_CF_ANALYTICS_TOKEN` del environment `production`.
   - El sitio ya incluye el script en PDN.
4. **No actives** "Web Analytics" en la configuración del proyecto de Pages: duplicaría el conteo, y el script que inyecta en línea lo bloquea la CSP.

Sin token, PDN funciona igual pero sin analítica, y la build lo advierte. La analítica no usa cookies; la Política de Tratamiento de Datos ya la describe.

## 9. Primer despliegue a PDN

1. Con QA en verde, abre el PR **`qa` → `main`** y espera las verificaciones.
2. Integra con **Create a merge commit**.
3. **Actions** → **Despliegue a PDN** queda **esperando aprobación**: **Review deployments** → `production` → **Approve and deploy**.
4. Al terminar, ambos jobs deben quedar en verde:
   - `deploy-production`: la publicación.
   - `smoke-production`: titular, WhatsApp, ubicación, robots, sitemap y 404.
5. Abre <https://conducirjrdelsinu.pages.dev>: el sitio público, sin la etiqueta QA.

---

## Revertir una publicación

Si el smoke falla o se detecta un problema en PDN:

1. **Workers & Pages** → `conducirjrdelsinu` → **Deployments**.
2. En los despliegues de **Production**, busca el anterior que estaba bien → menú **⋯** → **Rollback to this deployment** → confirmar.
3. PDN vuelve a esa versión en segundos, sin pasar por GitHub.
4. Después corrige el problema con el flujo normal: rama `feature/*` → PR a `qa` → QA → PR a `main`. La siguiente publicación reemplaza la versión revertida.

QA se revierte igual, buscando en **Preview** los despliegues de la rama `qa`.

## Conectar un dominio propio (si algún día se compra)

1. Con el dominio en Cloudflare (o con los DNS apuntando a Cloudflare): proyecto → **Custom domains** → **Set up a custom domain** → el dominio (por ejemplo `conducirjrdelsinu.com`) → seguir el asistente.
2. Pídeme el cambio de URL en un PR. Hay que actualizar:
   - `src/shared/constants/site.ts` (`CANONICAL_ORIGIN`);
   - `.env.production`;
   - `test:e2e:smoke` en `package.json`;
   - la URL de `deploy-prod.yml`;
   - el sitio de Web Analytics.

   Una prueba unitaria verifica que `site.ts` y `.env.production` coincidan.
3. El subdominio `pages.dev` sigue funcionando. Opcional: redirigirlo al dominio nuevo con una regla de Cloudflare.

## Mantenimiento

| Qué                                   | Cuándo                         | Cómo                                                                                                    |
| ------------------------------------- | ------------------------------ | ------------------------------------------------------------------------------------------------------- |
| Service Token `github-actions-qa`     | Antes de su vencimiento        | Crear uno nuevo (paso 6), actualizar los dos secrets de `qa`, agregarlo a la política y borrar el viejo |
| Token de API                          | Si tiene TTL, o si se filtra   | Crear uno nuevo (paso 3), actualizar los dos environments y revocar el viejo                            |
| Versión de Wrangler                   | Cada pocos meses               | `WRANGLER_VERSION` en `deploy-reusable.yml` (versión con más de 2 semanas)                              |
| Correos autorizados en QA             | Cuando cambie el equipo        | Paso 5.3                                                                                                |

## Problemas frecuentes

| Síntoma                                                           | Causa y solución                                                                                                                                  |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `deploy` falla con "Faltan los secrets…"                          | El secret no está en el environment correcto (paso 4). Los secrets del repositorio no sirven: deben ir en `qa` o `production`.                    |
| `deploy` falla con "Authentication error" o "project not found"   | Token sin el permiso **Cloudflare Pages · Edit**, Account ID equivocado, o el proyecto tiene otro nombre (variable `CF_PAGES_PROJECT`).           |
| `regression-qa` espera y falla con "QA no respondió 200"          | Falta la política **Service Auth** con el Service Token (paso 6.4) o los secrets `CF_ACCESS_*` no coinciden.                                      |
| QA se abre sin pedir correo                                       | La política de Access no está activa (paso 5.2) o la regla **Allow** incluye a "Everyone".                                                         |
| El despliegue a PDN no empieza                                    | Está esperando la aprobación del environment `production` (paso 9.3).                                                                             |
| PDN no muestra datos en Web Analytics                             | Falta `VITE_CF_ANALYTICS_TOKEN` en `production` (la build avisa) o el sitio de Web Analytics tiene otro hostname.                                 |
