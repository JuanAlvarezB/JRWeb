import type { z } from 'zod';
import { InvalidContentError } from '../../domain/errors/InvalidContentError';

/**
 * Valida un archivo de contenido con su esquema Zod.
 *
 * @param file - Nombre del archivo, para que el error diga dónde corregir.
 * @throws {InvalidContentError} Con cada problema y su ruta (p. ej. `[1].hours.theory`).
 */
export function parseContent<Schema extends z.ZodType>(
  schema: Schema,
  raw: unknown,
  file: string,
): z.output<Schema> {
  const result = schema.safeParse(raw);
  if (result.success) return result.data;
  const issues = result.error.issues.map((issue) => {
    const path = issue.path
      .map((key) => (typeof key === 'number' ? `[${String(key)}]` : `.${String(key)}`))
      .join('');
    return `${path === '' ? '(raíz)' : path}: ${issue.message}`;
  });
  throw new InvalidContentError(file, issues);
}
