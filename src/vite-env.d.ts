/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ENV_NAME: string;
  readonly VITE_SITE_URL: string;
  readonly VITE_CF_ANALYTICS_TOKEN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/** Año en que se generó la build (vite.config.ts → `define`). */
declare const __BUILD_YEAR__: number;
