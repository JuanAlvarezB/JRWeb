import { useCallback, useRef } from 'react';

/** Margen inferior: la tarjeta entra cuando ya asoma un poco en pantalla. */
const ROOT_MARGIN = '0px 0px -8% 0px';

let sharedObserver: IntersectionObserver | undefined;

/** Un solo observador para todas las tarjetas de la página. */
function observer(): IntersectionObserver {
  sharedObserver ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        (entry.target as HTMLElement).dataset.reveal = 'shown';
        sharedObserver?.unobserve(entry.target);
      }
    },
    { rootMargin: ROOT_MARGIN },
  );
  return sharedObserver;
}

function canAnimate(): boolean {
  return (
    typeof IntersectionObserver !== 'undefined' &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/**
 * Entrada de tarjetas (DESIGN.md §7): las que están bajo el borde de la pantalla al
 * cargar se ocultan y aparecen al llegar a ellas, una sola vez. Las visibles al cargar
 * no se tocan (el HTML prerenderizado no parpadea). Sin efecto con "reducir movimiento".
 *
 * @returns Ref de callback para el elemento animado.
 */
export function useReveal(): (node: HTMLElement | null) => void {
  const current = useRef<HTMLElement | null>(null);

  return useCallback((node: HTMLElement | null) => {
    if (current.current !== null) {
      // Solo hay observador si alguna tarjeta llegó a animarse.
      sharedObserver?.unobserve(current.current);
      delete current.current.dataset.reveal;
    }
    current.current = node;
    if (node === null || !canAnimate()) return;
    if (node.getBoundingClientRect().top < window.innerHeight) return;
    node.dataset.reveal = 'pending';
    observer().observe(node);
  }, []);
}
