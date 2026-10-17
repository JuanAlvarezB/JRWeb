import type { Location } from '../../domain/entities/Location';
import type { LocationRepository } from '../../domain/repositories/LocationRepository';
import { mapLocation } from '../mappers/locationMapper';
import { memoize } from './memoize';

/** Implementación de `LocationRepository` con el contenido estático del release 1. */
export class StaticLocationRepository implements LocationRepository {
  private readonly load: () => Location;

  /** @param source - Contenido del JSON (sin validar; se valida al primer uso). */
  constructor(source: unknown) {
    this.load = memoize(() => mapLocation(source));
  }

  get(): Promise<Location> {
    return Promise.resolve().then(() => this.load());
  }
}
