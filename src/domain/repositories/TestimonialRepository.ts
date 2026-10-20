import type { RatingSummary, Testimonial } from '../entities/Testimonial';

/** Fuente de las opiniones reales de Google y de la calificación. */
export interface TestimonialRepository {
  /** @returns Las opiniones en el orden en que se muestran. */
  list(): Promise<readonly Testimonial[]>;
  /** @returns La calificación de Google con su fecha de corte. */
  getRating(): Promise<RatingSummary>;
}
