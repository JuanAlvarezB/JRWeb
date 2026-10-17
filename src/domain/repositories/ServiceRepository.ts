import type { Service } from '../entities/Service';

/** Fuente de los servicios (cursos por categoría de licencia). */
export interface ServiceRepository {
  /** @returns Todos los servicios validados, en cualquier orden. */
  list(): Promise<readonly Service[]>;
}
