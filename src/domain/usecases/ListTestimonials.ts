import type { RatingSummary, Testimonial } from '../entities/Testimonial';
import type { TestimonialRepository } from '../repositories/TestimonialRepository';

/** Opiniones reales y calificación de Google, para mostrarlas juntas. */
export interface TestimonialsOverview {
  readonly rating: RatingSummary;
  readonly testimonials: readonly Testimonial[];
}

/** Obtiene las opiniones de Google con su calificación. */
export class ListTestimonials {
  constructor(private readonly testimonials: TestimonialRepository) {}

  /** @returns La calificación y las opiniones (la sección se oculta si no hay opiniones). */
  async execute(): Promise<TestimonialsOverview> {
    const [rating, testimonials] = await Promise.all([
      this.testimonials.getRating(),
      this.testimonials.list(),
    ]);
    return { rating, testimonials };
  }
}
