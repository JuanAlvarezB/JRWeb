import type { JSX, ReactNode } from 'react';
import { cx } from '@/shared/utils/cx';
import styles from './Card.module.css';

export type CardElement = 'div' | 'article' | 'section' | 'li' | 'aside';

/**
 * Relleno según el tipo de tarjeta (handoff §2):
 * - `lg`: 40 × 32 en escritorio (beneficios). `md`: 32 (planes, testimonios).
 * - `sm`: 24 (canales de contacto, tarjetas del hero). En móvil, 24 / 24 / 20.
 */
export type CardPadding = 'lg' | 'md' | 'sm' | 'none';

interface CardProps {
  readonly as?: CardElement;
  readonly padding?: CardPadding;
  /** Sombra un poco mayor en hover, sin escalar (DESIGN.md §7). */
  readonly hoverable?: boolean;
  readonly className?: string | undefined;
  readonly children: ReactNode;
  readonly ariaLabelledBy?: string | undefined;
  readonly testId?: string | undefined;
}

const PADDING_CLASS: Record<CardPadding, string | undefined> = {
  lg: styles.paddingLg,
  md: styles.paddingMd,
  sm: styles.paddingSm,
  none: undefined,
};

/** Superficie blanca con radio 20 y sombra teñida de verde (DESIGN.md §4–5). */
export function Card({
  as: Element = 'div',
  padding = 'md',
  hoverable = true,
  className,
  children,
  ariaLabelledBy,
  testId,
}: CardProps): JSX.Element {
  return (
    <Element
      className={cx(styles.card, PADDING_CLASS[padding], hoverable && styles.hoverable, className)}
      aria-labelledby={ariaLabelledBy}
      data-testid={testId}
    >
      {children}
    </Element>
  );
}
