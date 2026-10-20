import { DomainError } from './DomainError';

/** Se pidió un elemento que no existe (p. ej. un curso de una categoría no ofrecida). */
export class NotFoundError extends DomainError {
  constructor(
    readonly entity: string,
    readonly key: string,
  ) {
    super(`${entity} no encontrado: ${key}`);
  }
}
