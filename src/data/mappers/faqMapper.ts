import { createFaq, type Faq } from '../../domain/entities/Faq';
import { InvalidContentError } from '../../domain/errors/InvalidContentError';
import { findDuplicates } from '../../domain/shared/validation';
import { faqSchema } from '../schemas/faqSchema';
import { parseContent } from '../schemas/parseContent';

/** `faq.json` → preguntas validadas con identificadores únicos. */
export function mapFaqs(raw: unknown): Faq[] {
  const faqs = parseContent(faqSchema, raw, 'faq.json').map(createFaq);
  const duplicated = findDuplicates(faqs.map((faq) => faq.id));
  if (duplicated.length > 0) {
    throw new InvalidContentError('faq.json', [`Preguntas repetidas: ${duplicated.join(', ')}.`]);
  }
  return faqs;
}
