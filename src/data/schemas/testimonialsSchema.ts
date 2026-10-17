import { z } from 'zod';
import { httpsUrl, isoDate, nonNegativeInt, text } from './common';

/** Esquema de `testimonials.json`: calificación de Google y opiniones reales. */
export const testimonialsSchema = z.strictObject({
  rating: z.strictObject({
    score: z.number(),
    reviewCount: nonNegativeInt,
    asOf: isoDate,
    reviewsUrl: httpsUrl,
  }),
  testimonials: z.array(
    z.strictObject({
      id: text,
      quote: text,
      author: text.optional(),
      source: z.literal('google'),
      publishedAt: isoDate.optional(),
      retrievedAt: isoDate,
    }),
  ),
});
