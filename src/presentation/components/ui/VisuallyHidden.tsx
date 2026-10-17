import type { JSX, ReactNode } from 'react';
import styles from './VisuallyHidden.module.css';

interface VisuallyHiddenProps {
  /**
   * `span` (por defecto) o `h2`: título de sección que solo leen los lectores de
   * pantalla, para no saltar niveles de encabezado cuando el diseño no muestra uno.
   */
  readonly as?: 'span' | 'h2';
  readonly id?: string | undefined;
  readonly children: ReactNode;
}

/** Texto que solo leen los lectores de pantalla. */
export function VisuallyHidden({
  as: Element = 'span',
  id,
  children,
}: VisuallyHiddenProps): JSX.Element {
  return (
    <Element id={id} className={styles.visuallyHidden}>
      {children}
    </Element>
  );
}
