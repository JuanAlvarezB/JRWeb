import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';

/** Archivo de la fuente del titular (Barlow Condensed 800 itálica, subconjunto latino). */
const DISPLAY_FONT_FILE = /barlow-condensed-latin-800-italic-[\w-]+\.woff2$/;

/**
 * Precarga solo la fuente del titular (DESIGN.md §3): el H1 display es lo primero
 * que se ve y así se evita el salto de la fuente de respaldo. Solo actúa en `build`.
 */
function preloadDisplayFont(): Plugin {
  return {
    name: 'jr:preload-display-font',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(_html, context) {
        const fontFile = Object.keys(context.bundle ?? {}).find((file) =>
          DISPLAY_FONT_FILE.test(file),
        );
        if (fontFile === undefined) {
          throw new Error('No se encontró la fuente del titular para precargarla.');
        }
        return [
          {
            tag: 'link',
            attrs: {
              rel: 'preload',
              href: `/${fontFile}`,
              as: 'font',
              type: 'font/woff2',
              crossorigin: '',
            },
            injectTo: 'head-prepend',
          },
        ];
      },
    },
  };
}

/**
 * Configuración de Vite.
 *
 * - `--mode development | qa | production` elige el archivo `.env.[modo]`.
 * - Los archivos con hash van a `/static/` para poder cachearlos como inmutables
 *   en `_headers` sin afectar a `public/assets/` (logos y SVG sin hash).
 */
export default defineConfig({
  plugins: [react(), preloadDisplayFont()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    modules: {
      localsConvention: 'camelCaseOnly',
    },
  },
  build: {
    assetsDir: 'static',
    sourcemap: false,
  },
  server: {
    port: 5173,
    strictPort: true,
  },
  preview: {
    port: 4173,
    strictPort: true,
  },
});
