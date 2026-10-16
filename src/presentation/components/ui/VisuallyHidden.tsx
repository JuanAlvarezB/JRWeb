import type { JSX, ReactNode } from 'react';
import styles from './VisuallyHidden.module.css';

interface VisuallyHiddenProps {
  readonly children: ReactNode;
}

/** Texto que solo leen los lectores de pantalla. */
export function VisuallyHidden({ children }: VisuallyHiddenProps): JSX.Element {
  return <span className={styles.visuallyHidden}>{children}</span>;
}
