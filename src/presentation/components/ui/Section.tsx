import type { JSX, ReactNode } from 'react';
import { cx } from '@/shared/utils/cx';
import styles from './Section.module.css';

/** `wide`: contenedor de 1200 px. `reading`: columna de lectura de 720 px. */
export type SectionWidth = 'wide' | 'reading';

interface SectionProps {
  /** Ancla de la sección (p. ej. `horarios` para "Ver horarios"). */
  readonly id?: string | undefined;
  /** ID del título que nombra la sección. */
  readonly labelledBy?: string | undefined;
  /** Nombre de la sección cuando no tiene título visible. */
  readonly label?: string | undefined;
  readonly width?: SectionWidth;
  readonly className?: string | undefined;
  readonly children: ReactNode;
}

/**
 * Sección de página (DESIGN.md §4 y §8): contenedor centrado sobre Blanco Cálido, separado
 * por espacio (80 px escritorio, 48 px móvil), nunca por bandas de color.
 */
export function Section({
  id,
  labelledBy,
  label,
  width = 'wide',
  className,
  children,
}: SectionProps): JSX.Element {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      aria-label={label}
      className={cx(styles.section, styles[width], className)}
    >
      {children}
    </section>
  );
}
