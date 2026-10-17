import {
  createRatingSummary,
  createTestimonial,
  type RatingSummary,
  type Testimonial,
} from '../../domain/entities/Testimonial';
import { parseContent } from '../schemas/parseContent';
import { testimonialsSchema } from '../schemas/testimonialsSchema';

export interface TestimonialsContent {
  readonly rating: RatingSummary;
  readonly testimonials: readonly Testimonial[];
}

/** `testimonials.json` → calificación y opiniones reales validadas. */
export function mapTestimonials(raw: unknown): TestimonialsContent {
  const content = parseContent(testimonialsSchema, raw, 'testimonials.json');
  return {
    rating: createRatingSummary(content.rating),
    testimonials: content.testimonials.map(createTestimonial),
  };
}
