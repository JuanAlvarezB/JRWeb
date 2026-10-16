import type { JSX } from 'react';
import { cx } from '@/shared/utils/cx';
import styles from './Ribbon.module.css';

/**
 * - `responsive` (por defecto): pequeña en móvil y grande en escritorio (handoff §2).
 * - `large`: Rojo Franja, texto bold 22 px (≥ 19 px por contraste).
 * - `small`: Rojo Aguja, texto 14 px.
 */
export type RibbonSize = 'responsive' | 'large' | 'small';

interface RibbonProps {
  readonly children: string;
  readonly size?: RibbonSize;
  readonly className?: string | undefined;
}

/**
 * Franja firma del logo (DESIGN.md §5): paralelogramo con cortes a 30°.
 * Máximo una por pantalla; no es interactiva.
 */
export function Ribbon({ children, size = 'responsive', className }: RibbonProps): JSX.Element {
  return <p className={cx(styles.ribbon, styles[size], className)}>{children}</p>;
}
