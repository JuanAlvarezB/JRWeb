import { useEffect, useState } from 'react';

/**
 * `true` cuando la página bajó más de `threshold` px (menú compacto y línea inferior).
 * Escucha el scroll de forma pasiva y actualiza una vez por cuadro.
 */
export function useScrolledPast(threshold: number): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = (): void => {
      frame = 0;
      setScrolled(window.scrollY > threshold);
    };
    const onScroll = (): void => {
      if (frame === 0) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, [threshold]);

  return scrolled;
}
