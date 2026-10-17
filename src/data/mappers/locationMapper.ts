import { createLocation, type Location } from '../../domain/entities/Location';
import { locationSchema } from '../schemas/locationSchema';
import { parseContent } from '../schemas/parseContent';

/** `location.json` → ubicación validada. */
export function mapLocation(raw: unknown): Location {
  return createLocation(parseContent(locationSchema, raw, 'location.json'));
}
