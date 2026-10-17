import { deepFreeze, Issues, isNonEmpty } from '../shared/validation';

/** Temas de las preguntas, en el orden en que se muestran. */
export const FAQ_TOPICS = ['courses', 'schedules', 'pricing', 'location'] as const;

export type FaqTopic = (typeof FAQ_TOPICS)[number];

/** Otras páginas donde se repite la pregunta, además de Preguntas frecuentes. */
export type FaqPage = 'plans';

/** Aparición de la pregunta en otra página, con su posición en esa página. */
export interface FaqPlacement {
  readonly page: FaqPage;
  readonly order: number;
}

/**
 * Acción dentro de la respuesta (link de acción):
 * `whatsapp` abre WhatsApp, `directions` la ubicación, `plans` la página de planes.
 */
export interface FaqAction {
  readonly kind: 'whatsapp' | 'directions' | 'plans';
  readonly label: string;
}

export interface Faq {
  readonly id: string;
  readonly topic: FaqTopic;
  readonly question: string;
  readonly answer: string;
  readonly action?: FaqAction | undefined;
  readonly placements: readonly FaqPlacement[];
  /** Posición dentro de su tema (menor = primero). */
  readonly order: number;
}

/** @throws {InvalidContentError} Si falta texto o la pregunta no es una pregunta. */
export function createFaq(props: Faq): Faq {
  const issues = new Issues(`Faq ${props.id}`);
  issues.check(/^[a-z0-9-]+$/u.test(props.id), 'El id debe usar minúsculas, números y guiones.');
  issues.check(/^¿.+\?$/u.test(props.question.trim()), 'La pregunta debe ir entre ¿ y ?.');
  issues.check(isNonEmpty(props.answer), 'La respuesta es obligatoria.');
  const pages = props.placements.map((placement) => placement.page);
  issues.check(
    new Set(pages).size === pages.length,
    'Una pregunta aparece una sola vez por página.',
  );
  if (props.action !== undefined) {
    issues.check(isNonEmpty(props.action.label), 'La acción necesita un texto.');
  }
  issues.throwIfAny();
  return deepFreeze({ ...props });
}

/** Preguntas de un tema, para mostrarlas agrupadas. */
export interface FaqGroup {
  readonly topic: FaqTopic;
  readonly faqs: readonly Faq[];
}

/** Agrupa por tema en el orden canónico, ordenando cada grupo y omitiendo temas vacíos. */
export function groupFaqsByTopic(faqs: readonly Faq[]): FaqGroup[] {
  return FAQ_TOPICS.map((topic) => ({
    topic,
    faqs: faqs.filter((faq) => faq.topic === topic).sort((a, b) => a.order - b.order),
  })).filter((group) => group.faqs.length > 0);
}
