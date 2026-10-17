/**
 * Contrato entre la build del servidor (`src/entry-server.tsx`) y el script
 * `scripts/prerender.ts`. Sin alias `@/`: lo importa también el script de Node.
 */

/** Una página que se genera como HTML estático. */
export interface PrerenderTarget {
  /** Ruta que se renderiza (p. ej. `/planes`). */
  readonly path: string;
  /** Archivo de salida en `dist/` (p. ej. `planes.html`, que Pages sirve en `/planes`). */
  readonly file: string;
  /** Si va en el sitemap (la 404 no). */
  readonly inSitemap: boolean;
  /**
   * Módulo de la página (p. ej. `src/presentation/pages/PlansPage.tsx`): con él se
   * buscan en el manifiesto de Vite su CSS y su JS para enlazarlos en el HTML.
   */
  readonly module: string;
}

/** Resultado de renderizar una página en el servidor. */
export interface PrerenderedPage {
  /** HTML del contenido de `#root`. */
  readonly html: string;
  /** Etiquetas del `<head>`: título, descripción, canónica, Open Graph y JSON-LD. */
  readonly head: string;
  /** Caché de TanStack Query serializada para hidratar sin repetir consultas. */
  readonly state: string;
}

/** Lo que exporta la build del servidor. */
export interface ServerEntry {
  readonly PRERENDER_TARGETS: readonly PrerenderTarget[];
  renderPage(path: string): Promise<PrerenderedPage>;
}

/** ID del `<script type="application/json">` con la caché de consultas. */
export const QUERY_STATE_ELEMENT_ID = 'jr-query-state';
