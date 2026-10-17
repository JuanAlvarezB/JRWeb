import { useSuspenseQueries } from '@tanstack/react-query';
import { useDependencies } from '@/presentation/providers/dependencyContext';
import { toWhatsAppLink, type WhatsAppInquiry } from './contactLinks';
import { queries } from './queries';

/**
 * Enlace al WhatsApp principal con el mensaje prellenado: general (botón flotante,
 * hero) o la consulta de precio o requisitos de una categoría (tarjetas de planes).
 *
 * @example useWhatsAppLink({ topic: 'price', category: 'B1' })
 */
export function useWhatsAppLink(inquiry?: WhatsAppInquiry): string {
  const deps = useDependencies();
  const [channels, messages] = useSuspenseQueries({
    queries: [queries.contactChannels(deps), queries.whatsAppMessages(deps)],
  });
  return toWhatsAppLink(channels.data, messages.data, inquiry);
}
