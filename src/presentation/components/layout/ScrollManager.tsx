import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';
import { MAIN_CONTENT_ID } from './SkipLink';

/** Cuadros que se espera a que aparezca la sección de un ancla (página diferida). */
const MAX_ANCHOR_FRAMES = 30;

function scrollToAnchor(id: string, framesLeft = MAX_ANCHOR_FRAMES): void {
  const target = document.getElementById(id);
  if (target !== null) {
    target.scrollIntoView();
    return;
  }
  if (framesLeft > 0) {
    requestAnimationFrame(() => {
      scrollToAnchor(id, framesLeft - 1);
    });
  }
}

/**
 * Al cambiar de página: vuelve arriba (o va al ancla, p. ej. `#horarios`) y pasa el
 * foco al contenido, para que el lector de pantalla empiece por la página nueva y no
 * por el menú. En la primera carga no mueve el foco.
 */
export function ScrollManager(): null {
  const { pathname, hash } = useLocation();
  const firstLoad = useRef(true);

  useEffect(() => {
    const isFirstLoad = firstLoad.current;
    firstLoad.current = false;
    if (hash !== '') {
      scrollToAnchor(decodeURIComponent(hash.slice(1)));
      return;
    }
    if (isFirstLoad) return;
    window.scrollTo({ top: 0 });
    document.getElementById(MAIN_CONTENT_ID)?.focus({ preventScroll: true });
  }, [pathname, hash]);

  return null;
}
