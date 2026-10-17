import { sortByCategory } from '../entities/LicenseCategory';
import type { Service } from '../entities/Service';
import type { ServiceRepository } from '../repositories/ServiceRepository';

/** Lista los servicios en el orden de las categorías (A2, B1, C1). */
export class ListServices {
  constructor(private readonly services: ServiceRepository) {}

  /** @returns Los servicios ordenados por categoría. */
  async execute(): Promise<readonly Service[]> {
    return sortByCategory(await this.services.list());
  }
}
