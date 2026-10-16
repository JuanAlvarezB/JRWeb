import type { JSX } from 'react';
import { cx } from '@/shared/utils/cx';
import styles from './HeroWash.module.css';

interface HeroWashProps {
  readonly className?: string | undefined;
}

/**
 * Aguada verde del hero (DESIGN.md §4): forma difuminada con el degradado del auto
 * del logo, detrás de las tarjetas flotantes. El centro queda limpio porque la
 * aguada nunca va detrás de texto. Es decorativa: no se anuncia.
 */
export function HeroWash({ className }: HeroWashProps): JSX.Element {
  return <div className={cx(styles.wash, className)} aria-hidden="true" />;
}
