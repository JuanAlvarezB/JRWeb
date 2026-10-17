import type { Faq, FaqPlacement, FaqTopic } from '../entities/Faq';
import { FAQ_TOPICS } from '../entities/Faq';
import type { FaqRepository } from '../repositories/FaqRepository';

/** Filtro opcional: por tema o por página donde se repite la pregunta. */
export interface FaqFilter {
  readonly topic?: FaqTopic;
  readonly placement?: FaqPlacement;
}

/** Lista las preguntas frecuentes en orden (tema y posición dentro del tema). */
export class ListFaqs {
  constructor(private readonly faqs: FaqRepository) {}

  /**
   * @param filter - p. ej. `{ placement: 'plans' }` para las preguntas de la página Planes.
   * @returns Las preguntas ordenadas por tema y posición.
   */
  async execute(filter: FaqFilter = {}): Promise<readonly Faq[]> {
    const all = await this.faqs.list();
    return all
      .filter((faq) => filter.topic === undefined || faq.topic === filter.topic)
      .filter((faq) => filter.placement === undefined || faq.placements.includes(filter.placement))
      .sort(
        (a, b) => FAQ_TOPICS.indexOf(a.topic) - FAQ_TOPICS.indexOf(b.topic) || a.order - b.order,
      );
  }
}
