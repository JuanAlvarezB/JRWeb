# Configuración de GitHub

Guía pantalla por pantalla para proteger el repositorio **JuanAlvarezB/JRWeb**. Todo funciona en el plan gratuito porque el repositorio es público.

**Principio:** trabajas solo y GitHub no permite aprobar tu propio PR. Por eso la protección se basa en **verificaciones automáticas obligatorias** (el pipeline `ci.yml`) y el control humano está en **tu aprobación del despliegue a PDN**.

## 0. Orden de activación (para no bloquearte)

Las verificaciones obligatorias exigen que `ci.yml` exista y reporte cada job. Si se activan antes, ningún PR se puede integrar: GitHub se queda esperando verificaciones que nunca llegan ("Expected — Waiting for status to be reported").

| Fase  | Cuándo                                                                      | Qué se activa                                                                                                                                                                                                |
| ----- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **1** | Hoy, antes de integrar cualquier PR                                         | Pasos 1 a 7: cuenta, ajustes, seguridad, rulesets **sin** verificaciones obligatorias, environments, Dependabot y Azure Boards. Ya queda prohibido subir directo a `qa` y `main`, forzar o borrar las ramas. |
| **2** | Cuando el PR que crea `ci.yml` haya corrido y todos sus jobs estén en verde | Paso 8: volver a importar los rulesets completos (con las 9 o 10 verificaciones).                                                                                                                            |
| **3** | Etapa de Cloudflare                                                         | Paso 5.3: secrets de los environments.                                                                                                                                                                       |

> El PR que agrega `ci.yml` sí ejecuta el pipeline (GitHub usa el workflow que trae el propio PR), así que puedes comprobar en ese PR que todos los nombres de job aparecen antes de exigirlos.

## 1. Cuenta personal

### 1.1 Autenticación en dos pasos (obligatoria)

1. Foto de perfil → **Settings** → **Password and authentication**.
2. **Two-factor authentication** → **Enable two-factor authentication**.
3. Usa una app (Google Authenticator, Microsoft Authenticator, 1Password…) y **guarda los códigos de recuperación** fuera del computador.

### 1.2 Correo privado en los commits (importante: repositorio público)

Cada commit guarda el correo del autor y en un repositorio público cualquiera puede verlo.

1. **Settings** → **Emails**.
2. Activa **Keep my email addresses private** y **Block command line pushes that expose my email**.
3. Copia la dirección que aparece con la forma `NUMERO+JuanAlvarezB@users.noreply.github.com`.
4. En la Terminal:

   ```bash
   git config --global user.email "NUMERO+JuanAlvarezB@users.noreply.github.com"
   ```

Si el primer commit ya tiene tu correo personal, mira el apartado 10.1 (solo se puede corregir **antes** de activar los rulesets).

## 2. Ajustes generales del repositorio

**Settings** → **General**:

| Sección        | Ajuste                                        | Valor                                                                                                                      |
| -------------- | --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Default branch | Rama por defecto                              | **`qa`** (botón ⇄ junto a `main` → elige `qa` → **Update**). Así los PR nuevos y las alertas de Dependabot apuntan a `qa`. |
| Pull Requests  | Allow merge commits                           | ✅                                                                                                                         |
| Pull Requests  | Allow squash merging                          | ❌                                                                                                                         |
| Pull Requests  | Allow rebase merging                          | ❌                                                                                                                         |
| Pull Requests  | Always suggest updating pull request branches | ✅                                                                                                                         |
| Pull Requests  | Automatically delete head branches            | ✅ (borra la `feature/*` al integrar)                                                                                      |

**Por qué solo merge commit:** para que `qa` tenga siempre el último commit de `main` hay que traerlo dentro de la rama feature (`git pull --no-rebase origin main`). Squash o rebase descartan ese vínculo y el PR `qa` → `main` quedaría "desactualizado".

## 3. Seguridad

**Settings** → **Advanced Security** (en algunas cuentas aparece como **Code security**):

| Opción                              | Valor                                                      |
| ----------------------------------- | ---------------------------------------------------------- |
| Dependency graph                    | ✅ Enable                                                  |
| Dependabot alerts                   | ✅ Enable                                                  |
| Dependabot security updates         | ✅ Enable                                                  |
| Secret Protection (Secret scanning) | ✅ Enable                                                  |
| Push protection                     | ✅ Enable (bloquea un push que contenga una llave o token) |
| Private vulnerability reporting     | ✅ Enable                                                  |

Todas son gratuitas en repositorios públicos.

## 4. Rulesets — fase 1 (sin verificaciones obligatorias)

Los archivos completos están en `.github/rulesets/`. En la fase 1 se importan y se les quita temporalmente la regla de verificaciones.

### 4.1 Importar `protect-qa`

1. **Settings** → **Rules** → **Rulesets**.
2. **New ruleset** ▾ → **Import a ruleset**.
3. Elige `.github/rulesets/protect-qa.json` desde tu computador.
4. Revisa la pantalla que se abre:
   - **Enforcement status:** Active.
   - **Bypass list:** vacía (sin excepciones, ni siquiera para ti).
   - **Target branches:** `qa`.
   - **Restrict deletions** ✅ · **Block force pushes** ✅.
   - **Require a pull request before merging** ✅ → _Required approvals_: **0** · _Require conversation resolution before merging_ ✅ · _Allowed merge methods_: **Merge**.
5. **Fase 1:** desmarca **Require status checks to pass**.
6. **Create**.

### 4.2 Importar `protect-main`

Igual que 4.1 con `.github/rulesets/protect-main.json` (target `main`). También desmarca **Require status checks to pass** en la fase 1.

### 4.3 Comprobar que funciona

```bash
git switch qa
git commit --allow-empty -m "prueba: no debe subir"
git push origin qa          # debe fallar: "Changes must be made through a pull request"
git reset --hard origin/qa  # deshace el commit de prueba
```

## 5. Environments

**Settings** → **Environments** → **New environment**.

### 5.1 `qa`

1. Nombre: `qa` → **Configure environment**.
2. **Deployment branches and tags** → **Selected branches and tags** → **Add deployment branch or tag rule** → `qa`.
3. Sin revisores (el despliegue a QA es automático).

### 5.2 `production`

1. Nombre: `production`.
2. **Required reviewers** ✅ → agrégate a ti (**JuanAlvarezB**).
3. **Prevent self-review**: ❌ **desactivado** (si no, no podrías aprobar tus propios despliegues).
4. **Deployment branches and tags** → **Selected branches and tags** → regla `main`.
5. **Save protection rules**.

### 5.3 Secrets y variables (fase 3, etapa de Cloudflare)

Cómo obtener cada valor, paso a paso: [`configuracion-cloudflare.md`](configuracion-cloudflare.md).

| Environment  | Tipo     | Nombre                    | Origen                                        |
| ------------ | -------- | ------------------------- | --------------------------------------------- |
| `qa`         | Secret   | `CLOUDFLARE_API_TOKEN`    | Token de Cloudflare con permiso solo de Pages |
| `qa`         | Secret   | `CLOUDFLARE_ACCOUNT_ID`   | Panel de Cloudflare                           |
| `qa`         | Secret   | `CF_ACCESS_CLIENT_ID`     | Service Token de Cloudflare Access            |
| `qa`         | Secret   | `CF_ACCESS_CLIENT_SECRET` | Service Token de Cloudflare Access            |
| `production` | Secret   | `CLOUDFLARE_API_TOKEN`    | Mismo tipo de token                           |
| `production` | Secret   | `CLOUDFLARE_ACCOUNT_ID`   | Panel de Cloudflare                           |
| `production` | Variable | `VITE_CF_ANALYTICS_TOKEN` | Cloudflare Web Analytics (es público)         |

Además, en **Settings** → **Secrets and variables** → **Actions** → **Variables** (del repositorio):

- `QA_REMOTE_DEPLOY` = `true` si Cloudflare Access quedó activo; `false` para el plan de respaldo (QA no se publica).
- `CF_PAGES_PROJECT`: solo si el proyecto de Pages no se llama `conducirjrdelsinu`.

Los valores **nunca** se escriben en el repositorio ni en la documentación.

## 6. Dependabot

Ya está configurado en `.github/dependabot.yml`: revisa npm y GitHub Actions cada lunes y abre los PR **hacia `qa`**, agrupados para no saturarte. Pasan por el mismo pipeline. No necesitan `AB#`.

> Las alertas de seguridad de Dependabot siempre van a la rama por defecto; por eso la rama por defecto es `qa`.

### 6.1 Qué PR abre

| Grupo o caso           | Qué incluye                                                               | Ejemplo de título                                    |
| ---------------------- | ------------------------------------------------------------------------- | ---------------------------------------------------- |
| `dev-dependencies`     | Parches y menores de las herramientas (Vite, Vitest, ESLint, Playwright…) | `chore(deps): bump the dev-dependencies group …`     |
| `runtime-dependencies` | Parches de lo que llega al sitio (React, TanStack Query, Zod…)            | `chore(deps): bump the runtime-dependencies group …` |
| Una dependencia sola   | Menores de producción y versiones mayores                                 | `chore(deps): bump react-router from 8.1.0 to 8.2.0` |
| GitHub Actions         | Nuevas versiones de las acciones (fijadas por SHA)                        | `chore(ci): bump actions/checkout from … to …`       |

### 6.2 Versiones mayores: regla del proyecto

Una versión mayor (de `9.x` a `10.x`) puede romper la compatibilidad. Antes de integrarla:

1. **Espera dos semanas desde su publicación.** El proyecto solo usa versiones con más de 2 semanas: da tiempo a que aparezcan y se corrijan los primeros errores. La fecha está en la página del paquete en npm (pestaña **Versions**).
2. **Comprueba que el ecosistema la soporte.** Los plugins que dependen de ella deben declarar la versión nueva en su `peerDependencies`. Hoy hay cuatro ignoradas en `.github/dependabot.yml`:

   | Paquete                 | Por qué se ignora la mayor                                                 | Cuándo quitarla de la lista                                                          |
   | ----------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
   | `typescript`            | `typescript-eslint` aún no soporta TypeScript 7                            | Cuando `typescript-eslint` publique soporte para la 7                                |
   | `eslint` y `@eslint/js` | `eslint-plugin-react` y `eslint-plugin-jsx-a11y` aún no soportan ESLint 10 | Cuando ambos plugins declaren ESLint 10                                              |
   | `@types/node`           | Los tipos deben coincidir con el Node del proyecto (24, `.nvmrc`)          | Al cambiar de Node en `.nvmrc` y en `engines` de `package.json` (el CI usa `.nvmrc`) |

3. **Lee las notas de la versión** (enlazadas en el PR de Dependabot) y busca cambios que afecten al proyecto.
4. **Deja que el CI decida.** Si todo pasa, integra con merge commit. Si falla, cierra el PR con un comentario del motivo; Dependabot no lo volverá a abrir hasta la siguiente versión.

Para quitar un paquete de la lista, borra su bloque en `ignore` de `.github/dependabot.yml` con un PR normal. Dependabot propondrá la mayor el lunes siguiente.

### 6.3 Qué no actualiza Dependabot

- **Wrangler** (la CLI de Cloudflare en `deploy-reusable.yml`) se ejecuta con `npx` y una versión fija: se revisa a mano ([configuracion-cloudflare.md](configuracion-cloudflare.md), "Mantenimiento").
- **El runner `ubuntu-24.04`**: cambiarlo regenera todas las capturas de referencia ([ambientes-y-despliegue.md](ambientes-y-despliegue.md), sección 2).
- **Node.js** (`.nvmrc`): se cambia a mano cuando salga el siguiente LTS.

### 6.4 Si un PR de Dependabot falla por las capturas

Una actualización de Playwright puede cambiar cómo se dibujan las páginas y hacer fallar `visual-tests` sin cambio de diseño. Ejecuta **Actualizar capturas de referencia** sobre la rama de Dependabot ([ambientes-y-despliegue.md](ambientes-y-despliegue.md), sección 2), revisa que las diferencias sean solo de dibujo y súbelas a esa rama.

## 7. Azure Boards (referencias `AB#`)

### 7.1 Conectar (una sola vez)

1. En Azure DevOps (`https://dev.azure.com/<tu organización>`) abre el proyecto.
2. **Project settings** (abajo a la izquierda) → **Boards** → **GitHub connections** → **Connect your GitHub account**.
3. Autoriza y elige el repositorio **JuanAlvarezB/JRWeb** → **Save**. Esto instala la app **Azure Boards** en GitHub.
4. Comprueba en GitHub: **Settings** → **GitHub Apps** → aparece **Azure Boards**.

Azure DevOps es gratuito hasta 5 usuarios con plan Basic y no pide tarjeta.

### 7.2 Cómo se usa

| Dónde              | Ejemplo                                                |
| ------------------ | ------------------------------------------------------ |
| Nombre de la rama  | `feature/42-dominio` (opcional)                        |
| Mensaje de commit  | `feat(dominio): agrega entidades y casos de uso AB#42` |
| Título del PR      | `feat(dominio): entidades y casos de uso AB#42`        |
| Descripción del PR | Sección "Trabajo en Azure Boards": `AB#42`             |

Usa solo `AB#42`, **no** `Fixes AB#42`: Azure Boards cierra el elemento al integrar en la rama por defecto, que es `qa`, y debe cerrarse cuando llegue a PDN. Ciérralo a mano después del despliegue a PDN (o muévelo a la columna que uses para "En QA").

## 8. Rulesets — fase 2 (con verificaciones obligatorias)

Cuando el PR que crea `ci.yml` muestre todos sus jobs en verde:

1. **Settings** → **Rules** → **Rulesets** → abre `protect-qa` → **⋯** → **Delete ruleset**.
2. **New ruleset** → **Import a ruleset** → `.github/rulesets/protect-qa.json`, esta vez **sin** desmarcar nada → **Create**.
3. Repite con `protect-main`.
4. Comprueba en el ruleset que **Require status checks to pass** lista:
   - `qa`: `lint`, `typecheck`, `content-validation`, `secret-scan`, `unit-tests`, `component-tests`, `build`, `e2e-tests`, `visual-tests`.
   - `main`: las mismas + `source-branch-check`.
   - **Require branches to be up to date before merging** ✅ en ambas.

Los nombres coinciden con el `name:` de cada job de `ci.yml`. Si algún día se renombra un job, hay que actualizar estos JSON.

## 9. Flujo diario de trabajo

```bash
# 1. Partir de qa actualizado
git switch qa && git pull origin qa
git switch -c feature/descripcion-corta

# 2. Traer el último main (sin rebase: conserva el vínculo con main)
git pull --no-rebase origin main

# 3. Trabajar y comprobar en tu equipo
npm run lint && npm run typecheck && npm test

# 4. Commit y push
git add .
git commit -m "feat(alcance): descripción del cambio AB#42"
git push -u origin feature/descripcion-corta
```

5. En GitHub: **Compare & pull request** → base **`qa`** → completa la plantilla con `AB#42` → **Create pull request**.
6. Cuando todo esté en verde y no haya conversaciones abiertas: **Merge pull request** (merge commit).
7. Para pasar a PDN: **New pull request** → base **`main`**, compare **`qa`** → completa el checklist de QA → integra → aprueba el despliegue en **Actions**.

## 10. Problemas frecuentes

### 10.1 Corregir el correo del primer commit (solo antes de activar los rulesets)

El primer commit (`first commit`) guarda el correo personal del autor. Como el repositorio aún tiene un solo commit y todavía no hay rulesets, se puede reescribir:

```bash
# Guarda los cambios sin commit (si hay)
git stash -u

# Configura el correo privado (paso 1.2) y reescribe el autor del único commit
git config --global user.email "NUMERO+JuanAlvarezB@users.noreply.github.com"
git switch main
git commit --amend --no-edit --reset-author
git push --force-with-lease origin main

# qa apunta al mismo commit nuevo
git switch qa
git reset --hard main
git push --force-with-lease origin qa

# Recrea la rama de trabajo desde el qa nuevo y recupera tus cambios
git branch -D feature/configuracion-github
git switch -c feature/configuracion-github
git stash pop
```

Después activa el paso 1.2 ("Block command line pushes that expose my email") para que no vuelva a pasar.

### 10.2 Otros

| Síntoma                                                                 | Causa y solución                                                                                                                                              |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| "Changes must be made through a pull request"                           | Intentaste subir directo a `qa` o `main`. Trabaja en una rama `feature/*`.                                                                                    |
| "This branch is out-of-date with the base branch" en `feature/*` → `qa` | Otro PR entró a `qa`. Botón **Update branch** en el PR.                                                                                                       |
| "This branch is out-of-date" en `qa` → `main`                           | `qa` no tiene el último commit de `main`. Crea `chore/sincroniza-main` desde `qa`, ejecuta `git pull --no-rebase origin main`, súbela y haz un PR hacia `qa`. |
| El PR espera verificaciones que nunca llegan                            | Se activaron las verificaciones antes de existir `ci.yml`, o un job cambió de nombre. Revisa la fase de la sección 0 y los nombres del paso 8.                |
| No puedo aprobar el despliegue a PDN                                    | En el environment `production`, **Prevent self-review** debe estar desactivado (paso 5.2).                                                                    |
