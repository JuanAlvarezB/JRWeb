import type { JSX } from 'react';
import { VisuallyHidden } from '@/presentation/components/ui/VisuallyHidden';
import { UI_TEXT } from '@/shared/constants/uiText';
import styles from './PageFallback.module.css';

/**
 * Espera mientras llega el código de una página (carga diferida). Reserva alto para
 * que el footer no salte; con el prerender casi nunca se ve.
 */
export function PageFallback(): JSX.Element {
  return (
    <div className={styles.fallback} aria-busy="true">
      <VisuallyHidden>{UI_TEXT.a11y.loading}</VisuallyHidden>
    </div>
  );
}
