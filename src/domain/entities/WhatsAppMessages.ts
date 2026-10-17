import { deepFreeze, Issues, isNonEmpty } from '../shared/validation';
import type { LicenseCategory } from './LicenseCategory';

/** Marcador que se reemplaza por la categoría (A2, B1 o C1) en los mensajes. */
export const CATEGORY_PLACEHOLDER = '{categoria}';

/**
 * Mensajes prellenados de WhatsApp. Indican que la persona viene de la página web
 * (p. ej. "Hola, vi en la página web el curso {categoria} y quiero conocer el precio.").
 */
export interface WhatsAppMessages {
  readonly general: string;
  readonly priceInquiry: string;
  readonly requirementsInquiry: string;
}

/** @throws {InvalidContentError} Si falta un mensaje o no incluye la categoría donde debe. */
export function createWhatsAppMessages(props: WhatsAppMessages): WhatsAppMessages {
  const issues = new Issues('WhatsAppMessages');
  issues.check(isNonEmpty(props.general), 'El mensaje general es obligatorio.');
  for (const key of ['priceInquiry', 'requirementsInquiry'] as const) {
    issues.check(
      props[key].includes(CATEGORY_PLACEHOLDER),
      `El mensaje "${key}" debe incluir ${CATEGORY_PLACEHOLDER}.`,
    );
  }
  issues.throwIfAny();
  return deepFreeze({ ...props });
}

/** Mensaje con la categoría en lugar del marcador. */
export function renderInquiry(template: string, category: LicenseCategory): string {
  return template.replaceAll(CATEGORY_PLACEHOLDER, category);
}
