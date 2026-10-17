import type { WhatsAppMessages } from '../entities/WhatsAppMessages';
import type { ContactRepository } from '../repositories/ContactRepository';

/** Obtiene las plantillas de los mensajes prellenados de WhatsApp. */
export class GetWhatsAppMessages {
  constructor(private readonly contact: ContactRepository) {}

  /** @returns Mensaje general, de precio y de requisitos (con `{categoria}`). */
  execute(): Promise<WhatsAppMessages> {
    return this.contact.getWhatsAppMessages();
  }
}
