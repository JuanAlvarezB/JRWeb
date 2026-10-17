/**
 * Formatos de texto en español para la interfaz. Funciones puras: sin React.
 * Los espacios dentro de "a. m." y "p. m." son de no separación, para que nunca
 * queden partidos en dos líneas.
 */

/** Espacio de no separación (U+00A0). */
export const NBSP = '\u00a0';

const NUMBER_WORDS = [
  'cero',
  'una',
  'dos',
  'tres',
  'cuatro',
  'cinco',
  'seis',
  'siete',
  'ocho',
  'nueve',
  'diez',
];

const MONTHS = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
];

/** Primera letra en mayúscula (p. ej. "lunes a viernes" → "Lunes a viernes"). */
export function capitalizeFirst(text: string): string {
  return text.charAt(0).toLocaleUpperCase('es-CO') + text.slice(1);
}

/**
 * Número en palabras para cantidades pequeñas en femenino ("cuatro franjas");
 * desde 11 se escribe en cifras.
 */
export function countInWords(count: number): string {
  return NUMBER_WORDS[count] ?? String(count);
}

/**
 * Cierra una frase con punto, sin duplicarlo cuando ya termina en uno
 * ("6:00–8:00 p. m." no pasa a "p. m..").
 */
export function withPeriod(text: string): string {
  return text.endsWith('.') ? text : `${text}.`;
}

/** Une una lista en español: "a", "a y b", "a, b y c". */
export function joinList(items: readonly string[]): string {
  if (items.length <= 1) return items.join('');
  return `${items.slice(0, -1).join(', ')} y ${items.at(-1) ?? ''}`;
}

/** Mes y año de una fecha AAAA-MM-DD (p. ej. "octubre de 2026"), sin zona horaria. */
export function formatMonthYear(isoDate: string): string {
  const [year, month] = isoDate.split('-').map(Number);
  return `${MONTHS[(month ?? 1) - 1] ?? ''} de ${String(year)}`;
}

/** Calificación con un decimal y punto, como la muestra Google ("5.0"). */
export function formatRating(score: number): string {
  return score.toFixed(1);
}
