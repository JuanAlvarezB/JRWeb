import type { JSX } from 'react';
import type { Testimonial } from '@/domain/entities/Testimonial';
import { Card } from '@/presentation/components/ui/Card';
import { formatMonthYear } from '@/presentation/formatters/text';
import { UI_TEXT } from '@/shared/constants/uiText';
import styles from './TestimonialCard.module.css';

const { testimonials: TEXT } = UI_TEXT;

/** Una comilla de apertura gruesa (bloque con la cola hacia arriba), 18 × 32. */
const QUOTE_MARK = 'M0 32V19C0 9 4 2 14 0l2 5c-5 2-7 5-7 9h7v18z';

interface TestimonialCardProps {
  readonly testimonial: Testimonial;
}

/**
 * Opinión real de Google (DESIGN.md §5): comillas Lima decorativas, cita en Tinta y
 * autor y fuente en Piedra, con la fecha de publicación o de consulta.
 */
export function TestimonialCard({ testimonial }: TestimonialCardProps): JSX.Element {
  const date = testimonial.publishedAt ?? testimonial.retrievedAt;
  const dateText =
    testimonial.publishedAt === undefined
      ? TEXT.retrieved(formatMonthYear(date))
      : formatMonthYear(date);

  return (
    <Card as="li" padding="md" className={styles.card}>
      <figure className={styles.figure}>
        <svg viewBox="0 0 40 32" className={styles.quoteMark} aria-hidden="true" focusable="false">
          <path d={QUOTE_MARK} />
          <path d={QUOTE_MARK} transform="translate(22 0)" />
        </svg>
        <blockquote className={styles.quote}>
          <p>{testimonial.quote}</p>
        </blockquote>
        <figcaption className={styles.caption}>
          {testimonial.author !== undefined && (
            <span className={styles.author}>{testimonial.author} · </span>
          )}
          {TEXT.source} · <time dateTime={date}>{dateText}</time>
        </figcaption>
      </figure>
    </Card>
  );
}
