import { useSuspenseQueries } from '@tanstack/react-query';
import { useDependencies } from '@/presentation/providers/dependencyContext';
import { toWhatsAppLink, type WhatsAppInquiry } from './contactLinks';
import { queries } from './queries';

/** Arma el enlace de WhatsApp de una consulta (o el general, sin consulta). */
export type WhatsAppLinkBuilder = (inquiry?: WhatsAppInquiry) => string;

/**
 * Constructor de enlaces de WhatsApp, para listas: la grilla de planes arma el
 * enlace de cada tarjeta sin llamar un hook por tarjeta.
 */
export function useWhatsAppLinkBuilder(): WhatsAppLinkBuilder {
  const deps = useDependencies();
  const [channels, messages] = useSuspenseQueries({
    queries: [queries.contactChannels(deps), queries.whatsAppMessages(deps)],
  });
  return (inquiry) => toWhatsAppLink(channels.data, messages.data, inquiry);
}

/**
 * Enlace al WhatsApp principal con el mensaje prellenado: general (botón flotante,
 * hero) o la consulta de precio o requisitos de una categoría.
 *
 * @example useWhatsAppLink({ topic: 'price', category: 'B1' })
 */
export function useWhatsAppLink(inquiry?: WhatsAppInquiry): string {
  return useWhatsAppLinkBuilder()(inquiry);
}
