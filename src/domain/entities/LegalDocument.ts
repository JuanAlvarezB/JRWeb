import { deepFreeze, findDuplicates, Issues, isIsoDate, isNonEmpty } from '../shared/validation';

/** Sección del documento: un `##` del Markdown, con su ancla para el índice. */
export interface LegalSection {
  /** Ancla estable (slug del título). */
  readonly id: string;
  readonly title: string;
  /** Texto de la sección en Markdown, sin el título. */
  readonly body: string;
}

export type LegalDocumentStatus = 'approved' | 'draft';

/** Documento legal publicado (Política de Tratamiento de Datos Personales). */
export interface LegalDocument {
  readonly title: string;
  readonly effectiveDate: string;
  readonly status: LegalDocumentStatus;
  readonly sections: readonly LegalSection[];
}

/** @throws {InvalidContentError} Si no hay secciones, se repite un ancla o la fecha no es válida. */
export function createLegalDocument(props: LegalDocument): LegalDocument {
  const issues = new Issues('LegalDocument');
  issues.check(isNonEmpty(props.title), 'El título es obligatorio.');
  issues.check(isIsoDate(props.effectiveDate), 'La fecha de vigencia debe ser AAAA-MM-DD.');
  issues.check(props.sections.length > 0, 'El documento necesita al menos una sección.');
  const duplicated = findDuplicates(props.sections.map((section) => section.id));
  issues.check(duplicated.length === 0, `Anclas repetidas: ${duplicated.join(', ')}.`);
  for (const section of props.sections) {
    issues.check(isNonEmpty(section.title), 'Hay una sección sin título.');
    issues.check(isNonEmpty(section.body), `La sección "${section.title}" está vacía.`);
  }
  issues.throwIfAny();
  return deepFreeze({ ...props });
}

/** Solo una versión aprobada por el asesor legal se publica en PDN. */
export function isPublishable(document: LegalDocument): boolean {
  return document.status === 'approved';
}
