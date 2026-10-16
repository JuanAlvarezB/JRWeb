import type { JSX } from 'react';
import { cx } from '@/shared/utils/cx';
import styles from './SectionHeading.module.css';

interface SectionHeadingProps {
  /** ID del título, para `aria-labelledby` de la sección. */
  readonly id?: string | undefined;
  readonly eyebrow?: string | undefined;
  readonly title: string;
  readonly subtitle?: string | undefined;
  readonly level?: 2 | 3;
  readonly align?: 'center' | 'start';
  readonly className?: string | undefined;
}

/** Encabezado de sección (DESIGN.md §5): eyebrow + título en Tinta + subtítulo opcional. */
export function SectionHeading({
  id,
  eyebrow,
  title,
  subtitle,
  level = 2,
  align = 'center',
  className,
}: SectionHeadingProps): JSX.Element {
  const Title = level === 2 ? 'h2' : 'h3';
  return (
    <header className={cx(styles.heading, styles[align], className)}>
      {eyebrow !== undefined && <p className={styles.eyebrow}>{eyebrow}</p>}
      <Title id={id} className={styles.title}>
        {title}
      </Title>
      {subtitle !== undefined && <p className={styles.subtitle}>{subtitle}</p>}
    </header>
  );
}
