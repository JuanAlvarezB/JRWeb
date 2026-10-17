import { z } from '../../shared/config/zod';
import { licenseCategory, nonNegativeInt, serviceType, text } from './common';

/** Esquema de `plans.json`. Estricto: un campo de precio hace fallar la validación. */
export const plansSchema = z.array(
  z.strictObject({
    category: licenseCategory,
    name: text,
    description: text,
    serviceType,
    ageRequirement: text,
    hours: z.strictObject({
      theory: nonNegativeInt,
      workshop: nonNegativeInt,
      driving: nonNegativeInt,
    }),
  }),
);
