import type { ContactChannel } from '../../domain/entities/ContactChannel';
import type { WhatsAppMessages } from '../../domain/entities/WhatsAppMessages';
import type { ContactRepository } from '../../domain/repositories/ContactRepository';
import { mapContact, type ContactContent } from '../mappers/contactMapper';
import { memoize } from './memoize';

/** Implementación de `ContactRepository` con `contact.json`. */
export class StaticContactRepository implements ContactRepository {
  private readonly load: () => ContactContent;

  /** @param source - Contenido de `contact.json` (se valida al primer uso). */
  constructor(source: unknown) {
    this.load = memoize(() => mapContact(source));
  }

  listChannels(): Promise<readonly ContactChannel[]> {
    return Promise.resolve().then(() => this.load().channels);
  }

  getWhatsAppMessages(): Promise<WhatsAppMessages> {
    return Promise.resolve().then(() => this.load().whatsAppMessages);
  }
}
