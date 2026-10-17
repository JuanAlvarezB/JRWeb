import { z } from 'zod';
import { licenseCategory, nonNegativeInt, serviceType, text } from './common';

/** Esquema de `services.json`. La foto es opcional (sin foto, el bloque va en una columna). */
export const servicesSchema = z.array(
  z.strictObject({
    category: licenseCategory,
    title: text,
    audience: text,
    summary: text,
    vehicles: text,
    serviceType,
    minimumAge: nonNegativeInt,
    ageRequirement: text,
    photo: z.strictObject({ src: text, alt: text }).optional(),
  }),
);
