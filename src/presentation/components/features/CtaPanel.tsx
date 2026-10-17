import { useId, type JSX, type ReactNode } from 'react';
import { cx } from '@/shared/utils/cx';
import styles from './CtaPanel.module.css';

/**
 * Llamado a la acción al cierre de una página (mockups):
 * - `plain`: centrado sobre Marfil (Nosotros).
 * - `card`: tarjeta centrada (Preguntas frecuentes).
 * - `row`: tarjeta a lo ancho con el texto a la izquierda y la acción a la derecha
 *   (Servicios).
 */
export type CtaPanelVariant = 'plain' | 'card' | 'row';

interface CtaPanelProps {
  readonly title: string;
  readonly text: string;
  readonly variant: CtaPanelVariant;
  /** El botón (WhatsApp o "Ver planes"). */
  readonly children: ReactNode;
}

export function CtaPanel({ title, text, variant, children }: CtaPanelProps): JSX.Element {
  const titleId = useId();
  return (
    <section aria-labelledby={titleId} className={cx(styles.panel, styles[variant])}>
      <div className={styles.copy}>
        <h2 id={titleId} className={styles.title}>
          {title}
        </h2>
        <p className={styles.text}>{text}</p>
      </div>
      <div className={styles.action}>{children}</div>
    </section>
  );
}
