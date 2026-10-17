import { z } from '../../shared/config/zod';
import { isoDate, text } from './common';

/** Esquema del encabezado (frontmatter) de `legal/data-policy.md`. */
export const dataPolicyFrontmatterSchema = z.looseObject({
  title: text,
  effectiveDate: isoDate,
  status: z.enum(['approved', 'draft']),
  analyticsSection: z.enum(['included', 'pending']),
});
