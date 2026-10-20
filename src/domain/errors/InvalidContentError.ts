import { DomainError } from './DomainError';

/**
 * El contenido no cumple una regla del negocio (p. ej. un NIT con dígito de
 * verificación incorrecto o un curso sin horas). Lista todos los problemas juntos
 * para corregirlos de una vez.
 */
export class InvalidContentError extends DomainError {
  constructor(
    readonly entity: string,
    readonly issues: readonly string[],
  ) {
    super(`${entity} inválido:\n- ${issues.join('\n- ')}`);
  }
}
