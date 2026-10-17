import type { ContactChannel } from '../entities/ContactChannel';
import type { WhatsAppMessages } from '../entities/WhatsAppMessages';

/** Fuente de los canales de contacto y de los mensajes prellenados de WhatsApp. */
export interface ContactRepository {
  /** @returns Los canales en el orden en que se muestran. */
  listChannels(): Promise<readonly ContactChannel[]>;
  /** @returns Las plantillas de mensajes de WhatsApp. */
  getWhatsAppMessages(): Promise<WhatsAppMessages>;
}
