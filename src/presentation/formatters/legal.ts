import { toSentenceCase } from './text';

const NUMBERED_HEADING = /^(\d+)\.\s*(.*?)\.?$/u;

/**
 * Siglas que se conservan en mayúsculas al pasar un título a tipo oración. Si una
 * versión nueva de la política trae otra sigla en un título, se agrega aquí.
 */
const ACRONYMS: readonly string[] = ['NIT', 'SIC', 'S.A.S', 'J&R', 'CEA'];

function restoreAcronyms(text: string): string {
  return ACRONYMS.reduce((result, acronym) => {
    const escaped = acronym.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&');
    return result.replace(new RegExp(`(?<![\\p{L}])${escaped}(?![\\p{L}])`, 'giu'), acronym);
  }, text);
}

/**
 * Título de una sección legal para mostrar: número con espacio y tipo oración, sin
 * el punto final ("13. PRUEBA DE LA AUTORIZACIÓN." → "13. Prueba de la autorización").
 * DESIGN.md §3: los títulos van en tipo oración, nunca en mayúsculas sostenidas. El
 * texto legal guardado no cambia; las siglas conocidas se conservan.
 */
export function formatLegalHeading(title: string): string {
  const numbered = NUMBERED_HEADING.exec(title.trim());
  const text =
    numbered === null
      ? toSentenceCase(title.trim().replace(/\.$/u, ''))
      : `${numbered[1] ?? ''}. ${toSentenceCase(numbered[2] ?? '')}`;
  return restoreAcronyms(text);
}
