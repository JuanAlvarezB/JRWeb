import type { Location } from '../entities/Location';
import type { LocationRepository } from '../repositories/LocationRepository';

/** Obtiene la ubicación de la sede (mapa, "Cómo llegar", Waze y datos estructurados). */
export class GetLocation {
  constructor(private readonly location: LocationRepository) {}

  /** @returns La ubicación de la sede. */
  execute(): Promise<Location> {
    return this.location.get();
  }
}
