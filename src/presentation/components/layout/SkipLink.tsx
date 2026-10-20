import type { JSX } from 'react';
import { UI_TEXT } from '@/shared/constants/uiText';
import styles from './SkipLink.module.css';

/** ID del `<main>`: destino de "Saltar al contenido" y del foco al cambiar de página. */
export const MAIN_CONTENT_ID = 'contenido';

/** Primer enlace de la página: lleva al contenido sin recorrer el menú (WCAG 2.4.1). */
export function SkipLink(): JSX.Element {
  return (
    <a href={`#${MAIN_CONTENT_ID}`} className={styles.skipLink}>
      {UI_TEXT.a11y.skipToContent}
    </a>
  );
}
