import { createService, type Service } from '../../domain/entities/Service';
import { InvalidContentError } from '../../domain/errors/InvalidContentError';
import { findDuplicates } from '../../domain/shared/validation';
import { parseContent } from '../schemas/parseContent';
import { servicesSchema } from '../schemas/servicesSchema';

/** `services.json` → servicios validados, una sola vez por categoría. */
export function mapServices(raw: unknown): Service[] {
  const services = parseContent(servicesSchema, raw, 'services.json').map(createService);
  const duplicated = findDuplicates(services.map((service) => service.category));
  if (duplicated.length > 0) {
    throw new InvalidContentError('services.json', [
      `Categorías repetidas: ${duplicated.join(', ')}.`,
    ]);
  }
  return services;
}
