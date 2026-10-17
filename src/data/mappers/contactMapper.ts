import { createContactChannel, type ContactChannel } from '../../domain/entities/ContactChannel';
import {
  createWhatsAppMessages,
  type WhatsAppMessages,
} from '../../domain/entities/WhatsAppMessages';
import { InvalidContentError } from '../../domain/errors/InvalidContentError';
import { findDuplicates } from '../../domain/shared/validation';
import { contactSchema } from '../schemas/contactSchema';
import { parseContent } from '../schemas/parseContent';

export interface ContactContent {
  readonly channels: readonly ContactChannel[];
  readonly whatsAppMessages: WhatsAppMessages;
}

/** `contact.json` → canales (en orden, uno por tipo) y mensajes de WhatsApp validados. */
export function mapContact(raw: unknown): ContactContent {
  const content = parseContent(contactSchema, raw, 'contact.json');
  const channels = content.channels.map(createContactChannel);
  const duplicated = findDuplicates(channels.map((channel) => channel.kind));
  const issues = duplicated.length > 0 ? [`Canales repetidos: ${duplicated.join(', ')}.`] : [];
  if (!channels.some((channel) => channel.kind === 'whatsapp')) {
    issues.push('Debe existir el canal de WhatsApp: es la acción principal del sitio.');
  }
  if (issues.length > 0) throw new InvalidContentError('contact.json', issues);
  return { channels, whatsAppMessages: createWhatsAppMessages(content.whatsAppMessages) };
}
