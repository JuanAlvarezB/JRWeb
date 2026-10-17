import { createLegalDocument, type LegalDocument } from '../../domain/entities/LegalDocument';
import { slugify } from '../../domain/shared/slug';
import { dataPolicyFrontmatterSchema } from '../schemas/dataPolicySchema';
import { parseContent } from '../schemas/parseContent';
import { parseFrontmatter, splitSections, stripFrontmatterAndComments } from './markdown';

export const DATA_POLICY_FILE = 'legal/data-policy.md';

/**
 * `legal/data-policy.md` → documento con una sección por cada `##`. El texto legal
 * no se modifica: solo se separa en secciones y se les da un ancla para el índice.
 */
export function mapDataPolicy(markdown: string): LegalDocument {
  const meta = parseContent(
    dataPolicyFrontmatterSchema,
    parseFrontmatter(markdown),
    DATA_POLICY_FILE,
  );
  const sections = splitSections(stripFrontmatterAndComments(markdown)).map((section) => ({
    id: slugify(section.title),
    title: section.title,
    body: section.body,
  }));
  return createLegalDocument({
    title: meta.title,
    effectiveDate: meta.effectiveDate,
    status: meta.status,
    sections,
  });
}
