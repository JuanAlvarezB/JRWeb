import { useSuspenseQuery } from '@tanstack/react-query';
import type { TestimonialsOverview } from '@/domain/usecases/ListTestimonials';
import { useDependencies } from '@/presentation/providers/dependencyContext';
import { queries } from './queries';

/** Calificación de Google y opiniones reales (la sección se oculta si no hay). */
export function useTestimonials(): TestimonialsOverview {
  return useSuspenseQuery(queries.testimonials(useDependencies())).data;
}
