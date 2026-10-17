import { useSuspenseQueries } from '@tanstack/react-query';
import type { ContactChannelKind } from '@/domain/entities/ContactChannel';
import { useDependencies } from '@/presentation/providers/dependencyContext';
import { toChannelLinks, type ContactChannelLinks } from './contactLinks';
import { queries } from './queries';

/**
 * Canales de contacto con sus enlaces listos (`tel:`, `mailto:`, WhatsApp con el
 * mensaje general y redes).
 *
 * @param kinds - Si se indica, solo esos canales (p. ej. `SOCIAL_KINDS` en el footer).
 */
export function useContactChannels(
  kinds?: readonly ContactChannelKind[],
): readonly ContactChannelLinks[] {
  const deps = useDependencies();
  const [channels, messages] = useSuspenseQueries({
    queries: [queries.contactChannels(deps, kinds), queries.whatsAppMessages(deps)],
  });
  return toChannelLinks(channels.data, messages.data);
}
