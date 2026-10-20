import { z } from '../../shared/config/zod';
import { FAQ_TOPICS } from '../../domain/entities/Faq';
import { nonNegativeInt, text } from './common';

/** Esquema de `faq.json`. */
export const faqSchema = z.array(
  z.strictObject({
    id: text,
    topic: z.enum(FAQ_TOPICS),
    order: nonNegativeInt,
    question: text,
    answer: text,
    action: z
      .strictObject({ kind: z.enum(['whatsapp', 'directions', 'plans']), label: text })
      .optional(),
    placements: z.array(z.strictObject({ page: z.enum(['plans']), order: nonNegativeInt })),
  }),
);
