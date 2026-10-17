# Instalación local (DEV) en macOS

Guía paso a paso para ejecutar el sitio en tu computador. DEV no se despliega: solo vive en tu equipo.

## 1. Requisitos

| Herramienta                                | Versión              | Para qué                                 |
| ------------------------------------------ | -------------------- | ---------------------------------------- |
| macOS                                      | 13 o superior        | Sistema operativo                        |
| Herramientas de línea de comandos de Xcode | La que instale macOS | Incluyen `git`                           |
| Homebrew                                   | La más reciente      | Instalar programas desde la Terminal     |
| Node.js                                    | 24 (LTS)             | Ejecutar Vite, las pruebas y los scripts |
| Visual Studio Code                         | La más reciente      | Editor recomendado                       |

Todo es gratuito y de uso comercial libre.

## 2. Instalar las herramientas

Abre la app **Terminal** y ejecuta cada bloque.

### 2.1 Git (herramientas de Xcode)

```bash
xcode-select --install
```

Si dice que ya están instaladas, sigue al siguiente paso. Comprueba con `git --version`.

### 2.2 Homebrew

Si `brew --version` responde, ya lo tienes. Si no, instálalo con el comando oficial de <https://brew.sh>.

### 2.3 Node.js 24

```bash
brew install node@24
node --version   # debe empezar por v24
npm --version
```

> Si ya tienes otra versión de Node, puedes usar [nvm](https://github.com/nvm-sh/nvm): el proyecto incluye `.nvmrc`, así que basta con `nvm install && nvm use` dentro de la carpeta.

### 2.4 GitHub CLI (se usará en la etapa de GitHub)

```bash
brew install gh
```

### 2.5 Visual Studio Code y extensiones

Al abrir la carpeta del proyecto, VS Code te ofrecerá instalar las extensiones recomendadas (ESLint, Prettier, Stylelint y EditorConfig). Acéptalas: así el código se formatea y se revisa al guardar.

## 3. Instalar el proyecto

```bash
cd ~/Desktop/JCAB/JR-pagina-web/JRWeb
npm ci
```

`npm ci` instala exactamente las versiones de `package-lock.json`.

> Puede aparecer el aviso `install-scripts ... esbuild`. Es normal: npm ya no ejecuta scripts de instalación sin permiso, y el proyecto no los necesita.

## 4. Ejecutar el sitio

| Comando                      | Qué hace                                                              | Dónde se ve             |
| ---------------------------- | --------------------------------------------------------------------- | ----------------------- |
| `npm run dev`                | Servidor de desarrollo con recarga automática (modo `development`)    | <http://localhost:5173> |
| `npm run preview:qa`         | Construye la versión de **QA** y la sirve tal como quedaría publicada | <http://localhost:4173> |
| `npm run preview:production` | Igual, con la configuración de **PDN**                                | <http://localhost:4173> |

Para detener un servidor: `Ctrl + C` en la Terminal.

## 5. Comprobar la calidad antes de un PR

| Comando                                         | Qué revisa                                                                                      |
| ----------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `npm run typecheck`                             | Tipos de TypeScript (modo estricto)                                                             |
| `npm run lint`                                  | ESLint (incluye las reglas de arquitectura), Stylelint (solo variables de DESIGN.md) y Prettier |
| `npm run format`                                | Corrige el formato de todos los archivos                                                        |
| `npm run build:qa` / `npm run build:production` | Construye `dist/` y genera `robots.txt` y `_headers` del ambiente                               |

| `npm run content:validate` | Contenido sin precios y política de datos lista |
| `npm run test:unit` / `npm run test:components` | Pruebas unitarias (con cobertura) y de componentes |
| `npm run test:e2e` / `npm run test:visual` | Playwright (regresión + accesibilidad) y regresión visual, sobre `dist/` |
| `npm test` | Todo lo anterior en orden: es lo que conviene ejecutar antes de un PR |

La primera vez, instala los navegadores de Playwright con `npx playwright install` (unos 300 MB, una sola vez). El detalle del pipeline está en [`ambientes-y-despliegue.md`](ambientes-y-despliegue.md).

## 6. Variables de entorno

Los archivos `.env.development`, `.env.qa` y `.env.production` **solo tienen valores públicos** y sí se suben al repositorio. Si necesitas probar algo solo en tu equipo, crea `.env.development.local` (lo ignora git).

**Nunca** pongas contraseñas, llaves ni tokens privados en ningún `.env`: todo lo que empieza por `VITE_` termina dentro del sitio publicado.

## 7. Problemas frecuentes

| Síntoma                              | Solución                                                                             |
| ------------------------------------ | ------------------------------------------------------------------------------------ |
| `Port 5173 is in use`                | Ya hay un servidor abierto. Ciérralo (`Ctrl + C`) o cierra la otra Terminal.         |
| `npm ERR! engine Unsupported engine` | Tu Node es anterior a la 24. Repite el paso 2.3.                                     |
| `Variables de entorno inválidas`     | Revisa que el `.env.[modo]` tenga `VITE_ENV_NAME` y `VITE_SITE_URL` sin barra final. |
