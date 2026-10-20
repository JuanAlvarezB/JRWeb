import type { Faq } from '../entities/Faq';

/** Fuente de las preguntas frecuentes. */
export interface FaqRepository {
  /** @returns Todas las preguntas validadas, en cualquier orden. */
  list(): Promise<readonly Faq[]>;
}
