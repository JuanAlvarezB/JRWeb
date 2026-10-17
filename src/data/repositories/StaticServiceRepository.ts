import type { Service } from '../../domain/entities/Service';
import type { ServiceRepository } from '../../domain/repositories/ServiceRepository';
import { mapServices } from '../mappers/servicesMapper';
import { memoize } from './memoize';

/** Implementación de `ServiceRepository` con el contenido estático del release 1. */
export class StaticServiceRepository implements ServiceRepository {
  private readonly load: () => readonly Service[];

  /** @param source - Contenido del JSON (sin validar; se valida al primer uso). */
  constructor(source: unknown) {
    this.load = memoize(() => mapServices(source));
  }

  list(): Promise<readonly Service[]> {
    return Promise.resolve().then(() => this.load());
  }
}
