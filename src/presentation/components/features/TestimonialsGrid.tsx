import type { JSX, ReactNode } from 'react';
import { useTestimonials } from '@/presentation/hooks/useTestimonials';
import { RatingCard } from './RatingCard';
import { TestimonialCard } from './TestimonialCard';
import styles from './TestimonialsGrid.module.css';

interface TestimonialsGridProps {
  /** Encabezado de la sección; se oculta junto con la grilla si no hay opiniones. */
  readonly header?: ReactNode;
}

/**
 * Calificación y opiniones de Google (Inicio). Si no hay opiniones reales no se
 * muestra nada: nunca se inventan (DESIGN.md §8).
 */
export function TestimonialsGrid({ header }: TestimonialsGridProps): JSX.Element | null {
  const { rating, testimonials } = useTestimonials();
  if (testimonials.length === 0) return null;

  return (
    <>
      {header}
      <ul className={styles.grid}>
        <RatingCard rating={rating} />
        {testimonials.map((testimonial) => (
          <TestimonialCard key={testimonial.id} testimonial={testimonial} />
        ))}
      </ul>
    </>
  );
}
