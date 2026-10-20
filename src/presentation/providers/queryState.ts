import { dehydrate, hydrate, type DehydratedState, type QueryClient } from '@tanstack/react-query';
import { QUERY_STATE_ELEMENT_ID } from '@/shared/prerender';

/**
 * Caché de consultas del prerender (patrón dehydrate/hydrate, el mismo de la fase 2).
 * Se escribe como JSON dentro de un `<script type="application/json">`: el navegador
 * no lo ejecuta (no choca con la CSP) y no se puede cerrar la etiqueta desde los datos.
 */
export function serializeQueryState(client: QueryClient): string {
  return JSON.stringify(dehydrate(client))
    .replace(/</gu, '\\u003c')
    .replace(/>/gu, '\\u003e')
    .replace(/&/gu, '\\u0026')
    .replace(/\u2028/gu, '\\u2028')
    .replace(/\u2029/gu, '\\u2029');
}

/**
 * Carga en el cliente la caché que dejó el prerender (si existe) y retira el elemento.
 *
 * @returns `true` si había caché.
 */
export function restoreQueryState(client: QueryClient, doc: Document = document): boolean {
  const element = doc.getElementById(QUERY_STATE_ELEMENT_ID);
  if (element?.textContent == null || element.textContent === '') return false;
  // El JSON lo generó `serializeQueryState` en la build: tiene la forma de `dehydrate`.
  hydrate(client, JSON.parse(element.textContent) as DehydratedState);
  element.remove();
  return true;
}
