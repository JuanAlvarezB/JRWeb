import type { Faq, FaqPage, FaqTopic } from '../entities/Faq';
import { FAQ_TOPICS } from '../entities/Faq';
import type { FaqRepository } from '../repositories/FaqRepository';

/** Filtro opcional: por tema o por página donde se repite la pregunta. */
export interface FaqFilter {
  readonly topic?: FaqTopic;
  readonly page?: FaqPage;
}

/** Posición de la pregunta en una página, o `undefined` si no aparece en ella. */
function orderIn(faq: Faq, page: FaqPage): number | undefined {
  return new Map(faq.placements.map((placement) => [placement.page, placement.order])).get(page);
}

/** Lista las preguntas frecuentes en orden (tema y posición dentro del tema). */
export class ListFaqs {
  constructor(private readonly faqs: FaqRepository) {}

  /**
   * @param filter - p. ej. `{ page: 'plans' }` para las preguntas de la página Planes,
   *   en el orden propio de esa página.
   * @returns Las preguntas ordenadas por tema y posición (o por la posición en la página).
   */
  async execute(filter: FaqFilter = {}): Promise<readonly Faq[]> {
    const all = (await this.faqs.list()).filter(
      (faq) => filter.topic === undefined || faq.topic === filter.topic,
    );
    const { page } = filter;
    if (page !== undefined) {
      return all
        .filter((faq) => orderIn(faq, page) !== undefined)
        .sort((a, b) => (orderIn(a, page) ?? 0) - (orderIn(b, page) ?? 0));
    }
    return all.sort(
      (a, b) => FAQ_TOPICS.indexOf(a.topic) - FAQ_TOPICS.indexOf(b.topic) || a.order - b.order,
    );
  }
}
