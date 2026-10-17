import type { Faq } from '../../domain/entities/Faq';
import type { FaqRepository } from '../../domain/repositories/FaqRepository';
import { mapFaqs } from '../mappers/faqMapper';
import { memoize } from './memoize';

/** Implementación de `FaqRepository` con el contenido estático del release 1. */
export class StaticFaqRepository implements FaqRepository {
  private readonly load: () => readonly Faq[];

  /** @param source - Contenido del JSON (sin validar; se valida al primer uso). */
  constructor(source: unknown) {
    this.load = memoize(() => mapFaqs(source));
  }

  list(): Promise<readonly Faq[]> {
    return Promise.resolve().then(() => this.load());
  }
}
