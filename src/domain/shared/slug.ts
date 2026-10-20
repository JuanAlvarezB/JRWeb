/**
 * Identificador legible para URL y anclas (índice de la política de datos).
 *
 * @example slugify('2. Identificación del Responsable') // "2-identificacion-del-responsable"
 */
export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/gu, '-')
    .replace(/^-+|-+$/gu, '');
}
