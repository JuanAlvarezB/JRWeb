import { InvalidContentError } from '../errors/InvalidContentError';

/**
 * Acumula los problemas de una entidad y, al final, falla con todos juntos.
 *
 * @example
 * const issues = new Issues('Plan');
 * issues.check(isNonEmpty(props.name), 'El nombre es obligatorio.');
 * issues.throwIfAny();
 */
export class Issues {
  private readonly messages: string[] = [];

  constructor(private readonly entity: string) {}

  /** Registra `message` si `condition` es falsa. */
  check(condition: boolean, message: string): void {
    if (!condition) this.messages.push(message);
  }

  /** Incorpora los problemas de una entidad anidada (p. ej. las horas de un plan). */
  include(prefix: string, run: () => void): void {
    try {
      run();
    } catch (error) {
      if (error instanceof InvalidContentError) {
        this.messages.push(...error.issues.map((issue) => `${prefix}: ${issue}`));
      } else {
        throw error;
      }
    }
  }

  /** @throws {InvalidContentError} Si se registró al menos un problema. */
  throwIfAny(): void {
    if (this.messages.length > 0) throw new InvalidContentError(this.entity, this.messages);
  }
}

export function isNonEmpty(value: string): boolean {
  return value.trim().length > 0;
}

export function isNonNegativeInteger(value: number): boolean {
  return Number.isInteger(value) && value >= 0;
}

/** Fecha en formato AAAA-MM-DD que existe en el calendario. */
export function isIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/u.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
}

export function isHttpsUrl(value: string): boolean {
  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
}

/** Ruta interna del sitio (p. ej. `/assets/images/sede.webp`). */
export function isSitePath(value: string): boolean {
  return value.startsWith('/') && !value.startsWith('//');
}

/** Valores repetidos de una lista (para exigir identificadores únicos). */
export function findDuplicates(values: readonly string[]): string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) duplicates.add(value);
    seen.add(value);
  }
  return [...duplicates];
}

/** Congela recursivamente un objeto de datos: las entidades son inmutables. */
export function deepFreeze<T>(value: T): T {
  if (value !== null && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const nested of Object.values(value)) deepFreeze(nested);
  }
  return value;
}
