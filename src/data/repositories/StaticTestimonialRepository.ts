import type { RatingSummary, Testimonial } from '../../domain/entities/Testimonial';
import type { TestimonialRepository } from '../../domain/repositories/TestimonialRepository';
import { mapTestimonials, type TestimonialsContent } from '../mappers/testimonialsMapper';
import { memoize } from './memoize';

/** Implementación de `TestimonialRepository` con `testimonials.json`. */
export class StaticTestimonialRepository implements TestimonialRepository {
  private readonly load: () => TestimonialsContent;

  /** @param source - Contenido de `testimonials.json` (se valida al primer uso). */
  constructor(source: unknown) {
    this.load = memoize(() => mapTestimonials(source));
  }

  list(): Promise<readonly Testimonial[]> {
    return Promise.resolve().then(() => this.load().testimonials);
  }

  getRating(): Promise<RatingSummary> {
    return Promise.resolve().then(() => this.load().rating);
  }
}
