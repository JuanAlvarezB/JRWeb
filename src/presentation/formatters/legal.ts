import { toSentenceCase } from './text';

const NUMBERED_HEADING = /^(\d+)\.\s*(.*?)\.?$/u;

/**
 * Título de una sección legal para mostrar: número con espacio y tipo oración, sin
 * el punto final ("13. PRUEBA DE LA AUTORIZACIÓN." → "13. Prueba de la autorización").
 * El texto legal guardado no cambia.
 */
export function formatLegalHeading(title: string): string {
  const numbered = NUMBERED_HEADING.exec(title.trim());
  if (numbered === null) return toSentenceCase(title.trim().replace(/\.$/u, ''));
  return `${numbered[1] ?? ''}. ${toSentenceCase(numbered[2] ?? '')}`;
}
