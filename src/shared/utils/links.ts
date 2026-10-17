/**
 * Enlaces externos a partir de datos ya validados por el dominio (números E.164,
 * correos y coordenadas). Funciones puras: no conocen React ni el contenido.
 */

const WHATSAPP_BASE = 'https://wa.me/';
const GOOGLE_MAPS_DIRECTIONS = 'https://www.google.com/maps/dir/';

/**
 * Chat de WhatsApp con un mensaje prellenado.
 *
 * @param phone - Número E.164 (p. ej. "+573165641048"); wa.me lo recibe sin el "+".
 * @param message - Texto prellenado; se omite si está vacío.
 * @example buildWhatsAppLink('+573165641048', 'Hola') // "https://wa.me/573165641048?text=Hola"
 */
export function buildWhatsAppLink(phone: string, message?: string): string {
  const url = new URL(phone.replace(/\D/gu, ''), WHATSAPP_BASE);
  if (message !== undefined && message !== '') url.searchParams.set('text', message);
  return url.href;
}

/** Llamada telefónica (`tel:`), con el número E.164 sin espacios. */
export function buildTelLink(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/gu, '')}`;
}

/** Correo electrónico (`mailto:`). */
export function buildMailtoLink(email: string): string {
  return `mailto:${email}`;
}

/**
 * Indicaciones para llegar en Google Maps (abre la app en el celular).
 *
 * @param destination - Coordenadas "lat,lng" (más precisas) o la dirección en texto.
 * @see https://developers.google.com/maps/documentation/urls/get-started#directions-action
 */
export function buildDirectionsLink(destination: string): string {
  const url = new URL(GOOGLE_MAPS_DIRECTIONS);
  url.searchParams.set('api', '1');
  url.searchParams.set('destination', destination);
  return url.href;
}
