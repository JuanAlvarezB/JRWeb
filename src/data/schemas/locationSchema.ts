import { z } from 'zod';
import { httpsUrl, text } from './common';

/** Esquema de `location.json`. Coordenadas, perfil y mapa son opcionales. */
export const locationSchema = z.strictObject({
  address: z.strictObject({ street: text, city: text, region: text, country: text }),
  businessName: text,
  coordinates: z.strictObject({ latitude: z.number(), longitude: z.number() }).optional(),
  googleProfileUrl: httpsUrl.optional(),
  embedUrl: httpsUrl.optional(),
});
