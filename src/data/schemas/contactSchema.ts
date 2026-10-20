import { z } from '../../shared/config/zod';
import { text } from './common';

/** Esquema de `contact.json`: canales en orden y mensajes prellenados de WhatsApp. */
export const contactSchema = z.strictObject({
  channels: z.array(
    z.strictObject({
      kind: z.enum(['whatsapp', 'phone', 'email', 'facebook', 'instagram', 'tiktok']),
      label: text,
      entries: z.array(z.strictObject({ value: text, display: text })),
    }),
  ),
  whatsAppMessages: z.strictObject({
    general: text,
    priceInquiry: text,
    requirementsInquiry: text,
  }),
});
