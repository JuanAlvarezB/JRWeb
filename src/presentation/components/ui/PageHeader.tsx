import type { JSX, ReactNode } from 'react';
import styles from './PageHeader.module.css';

interface PageHeaderProps {
  /** Titular display: el único H1 de la página (DESIGN.md §3). */
  readonly title: string;
  readonly lead?: ReactNode;
  /** Contenido bajo la entrada (p. ej. el botón grande de WhatsApp en Contáctanos). */
  readonly children?: ReactNode;
}

/** Encabezado de página: H1 display centrado y entrada en Piedra. */
export function PageHeader({ title, lead, children }: PageHeaderProps): JSX.Element {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>{title}</h1>
      {lead !== undefined && <p className={styles.lead}>{lead}</p>}
      {children}
    </header>
  );
}
