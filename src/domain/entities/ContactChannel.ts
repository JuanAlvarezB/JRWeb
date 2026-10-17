import { deepFreeze, Issues, isHttpsUrl, isNonEmpty } from '../shared/validation';

/** Canales de contacto. La escuela no tiene teléfono fijo. */
export type ContactChannelKind =
  'whatsapp' | 'phone' | 'email' | 'facebook' | 'instagram' | 'tiktok';

export const SOCIAL_KINDS: readonly ContactChannelKind[] = ['facebook', 'instagram', 'tiktok'];

/** Un dato del canal: el valor técnico y cómo se muestra. */
export interface ContactEntry {
  /** Valor para el enlace: número E.164 (+57…), correo o URL del perfil. */
  readonly value: string;
  /** Texto visible (p. ej. "+57 316 564 1048" o "@ceaconducirjrdelsinu"). */
  readonly display: string;
}

export interface ContactChannel {
  readonly kind: ContactChannelKind;
  /** Etiqueta del canal (p. ej. "Celular · llamadas"). */
  readonly label: string;
  readonly entries: readonly ContactEntry[];
}

/** Celular colombiano en formato E.164: +57 y 10 dígitos que empiezan por 3. */
const COLOMBIAN_MOBILE = /^\+573\d{9}$/u;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/u;

function isValidEntry(kind: ContactChannelKind, value: string): boolean {
  switch (kind) {
    case 'whatsapp':
    case 'phone':
      return COLOMBIAN_MOBILE.test(value);
    case 'email':
      return EMAIL.test(value);
    case 'facebook':
    case 'instagram':
    case 'tiktok':
      return isHttpsUrl(value) && new URL(value).hostname.includes(kind);
  }
}

/** @throws {InvalidContentError} Si el canal no tiene datos o alguno no es válido. */
export function createContactChannel(props: ContactChannel): ContactChannel {
  const issues = new Issues(`ContactChannel ${props.kind}`);
  issues.check(isNonEmpty(props.label), 'La etiqueta es obligatoria.');
  issues.check(props.entries.length > 0, 'El canal necesita al menos un dato.');
  for (const entry of props.entries) {
    issues.check(
      isValidEntry(props.kind, entry.value),
      `Dato no válido para ${props.kind}: "${entry.value}".`,
    );
    issues.check(isNonEmpty(entry.display), `Falta el texto visible de "${entry.value}".`);
  }
  issues.throwIfAny();
  return deepFreeze({ ...props });
}

/** Primer número de WhatsApp: el principal de todos los botones. */
export function primaryEntry(
  channels: readonly ContactChannel[],
  kind: ContactChannelKind,
): ContactEntry | undefined {
  return channels.find((channel) => channel.kind === kind)?.entries[0];
}
