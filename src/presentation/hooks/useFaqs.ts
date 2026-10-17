import { useSuspenseQuery } from '@tanstack/react-query';
import { groupFaqsByTopic, type Faq, type FaqGroup } from '@/domain/entities/Faq';
import type { FaqFilter } from '@/domain/usecases/ListFaqs';
import { useDependencies } from '@/presentation/providers/dependencyContext';
import { queries } from './queries';

/**
 * Preguntas frecuentes en orden.
 *
 * @param filter - p. ej. `{ page: 'plans' }` para las de la página Planes, en su orden.
 */
export function useFaqs(filter?: FaqFilter): readonly Faq[] {
  return useSuspenseQuery(queries.faqs(useDependencies(), filter)).data;
}

/** Preguntas agrupadas por tema, para la página de Preguntas frecuentes. */
export function useFaqGroups(): readonly FaqGroup[] {
  return useSuspenseQuery({ ...queries.faqs(useDependencies()), select: groupFaqsByTopic }).data;
}
