import { z } from 'zod';
import { text } from './common';

const statement = z.strictObject({ title: text, text });

/** Esquema de `company.json`. */
export const companySchema = z.strictObject({
  legalName: text,
  brandName: text,
  tagline: text,
  nit: text,
  summary: text,
  mission: statement,
  vision: statement,
  differentiators: z.array(z.strictObject({ id: text, title: text, description: text })),
});
