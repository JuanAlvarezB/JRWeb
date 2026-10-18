import { useEffect } from 'react';

/** Atributo de `<html>` que indica que la página ya es interactiva. */
export const HYDRATED_ATTRIBUTE = 'data-hydrated';

/**
 * Marca `<html data-hydrated>` cuando React termina de hidratar el HTML prerenderizado.
 * Antes de eso la página se ve completa pero los botones aún no responden; las pruebas
 * e2e esperan esta marca para no interactuar demasiado pronto. Los efectos solo corren
 * en el navegador, así que el HTML del prerender nunca la trae.
 */
export function useHydrationMarker(): void {
  useEffect(() => {
    document.documentElement.setAttribute(HYDRATED_ATTRIBUTE, '');
  }, []);
}
