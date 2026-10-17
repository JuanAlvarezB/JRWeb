import type {
  ContactChannel,
  ContactChannelKind,
  ContactEntry,
} from '@/domain/entities/ContactChannel';
import { primaryEntry } from '@/domain/entities/ContactChannel';
import type { LicenseCategory } from '@/domain/entities/LicenseCategory';
import { formatAddress, type Location } from '@/domain/entities/Location';
import { renderInquiry, type WhatsAppMessages } from '@/domain/entities/WhatsAppMessages';
import { NotFoundError } from '@/domain/errors/NotFoundError';
import {
  buildDirectionsLink,
  buildMailtoLink,
  buildTelLink,
  buildWhatsAppLink,
} from '@/shared/utils/links';

/** Dato de contacto listo para un enlace. */
export interface ContactLink extends ContactEntry {
  readonly href: string;
  /** Abre otra app o sitio (WhatsApp y redes): pestaña nueva y aviso accesible. */
  readonly external: boolean;
}

/** Canal de contacto con sus enlaces (tarjetas de Contáctanos, footer y menú). */
export interface ContactChannelLinks {
  readonly kind: ContactChannelKind;
  readonly label: string;
  readonly entries: readonly ContactLink[];
}

/** Consulta por WhatsApp sobre un curso; sin ella se usa el mensaje general. */
export interface WhatsAppInquiry {
  readonly topic: 'price' | 'requirements';
  readonly category: LicenseCategory;
}

/** Ubicación con la dirección en una línea y el enlace para llegar. */
export interface LocationView extends Location {
  readonly fullAddress: string;
  readonly directionsUrl: string;
}

function entryLink(kind: ContactChannelKind, value: string, messages: WhatsAppMessages): string {
  switch (kind) {
    case 'whatsapp':
      return buildWhatsAppLink(value, messages.general);
    case 'phone':
      return buildTelLink(value);
    case 'email':
      return buildMailtoLink(value);
    case 'facebook':
    case 'instagram':
    case 'tiktok':
      return value;
  }
}

/** Canales con el enlace de cada dato (WhatsApp con el mensaje general). */
export function toChannelLinks(
  channels: readonly ContactChannel[],
  messages: WhatsAppMessages,
): readonly ContactChannelLinks[] {
  return channels.map((channel) => ({
    kind: channel.kind,
    label: channel.label,
    entries: channel.entries.map((entry) => ({
      ...entry,
      href: entryLink(channel.kind, entry.value, messages),
      external: channel.kind !== 'phone' && channel.kind !== 'email',
    })),
  }));
}

/**
 * Enlace al WhatsApp principal con el mensaje que corresponde a la consulta.
 *
 * @throws {NotFoundError} Si el contenido no tiene WhatsApp (el esquema lo impide).
 */
export function toWhatsAppLink(
  channels: readonly ContactChannel[],
  messages: WhatsAppMessages,
  inquiry?: WhatsAppInquiry,
): string {
  const whatsApp = primaryEntry(channels, 'whatsapp');
  if (whatsApp === undefined) throw new NotFoundError('ContactChannel', 'whatsapp');
  const template = {
    general: messages.general,
    price: messages.priceInquiry,
    requirements: messages.requirementsInquiry,
  }[inquiry?.topic ?? 'general'];
  const message = inquiry === undefined ? template : renderInquiry(template, inquiry.category);
  return buildWhatsAppLink(whatsApp.value, message);
}

/** Ubicación con dirección completa e indicaciones (por coordenadas si las hay). */
export function toLocationView(location: Location): LocationView {
  const { coordinates } = location;
  const destination =
    coordinates === undefined
      ? formatAddress(location.address)
      : `${coordinates.latitude},${coordinates.longitude}`;
  return {
    ...location,
    fullAddress: formatAddress(location.address),
    directionsUrl: buildDirectionsLink(destination),
  };
}
