import type { Location } from '../entities/Location';

/** Fuente de la ubicación de la sede. */
export interface LocationRepository {
  /** @returns La ubicación validada (dirección, coordenadas y enlaces opcionales). */
  get(): Promise<Location>;
}
