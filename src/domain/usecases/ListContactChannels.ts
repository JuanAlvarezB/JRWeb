import type { ContactChannel, ContactChannelKind } from '../entities/ContactChannel';
import type { ContactRepository } from '../repositories/ContactRepository';

/** Lista los canales de contacto (Contáctanos, footer, menú y botón flotante). */
export class ListContactChannels {
  constructor(private readonly contact: ContactRepository) {}

  /**
   * @param kinds - Si se indica, solo esos canales (p. ej. solo redes sociales).
   * @returns Los canales en el orden del contenido.
   */
  async execute(kinds?: readonly ContactChannelKind[]): Promise<readonly ContactChannel[]> {
    const channels = await this.contact.listChannels();
    return kinds === undefined
      ? channels
      : channels.filter((channel) => kinds.includes(channel.kind));
  }
}
