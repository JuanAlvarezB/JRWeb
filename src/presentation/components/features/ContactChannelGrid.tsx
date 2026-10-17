import type { JSX } from 'react';
import type { ContactChannelKind } from '@/domain/entities/ContactChannel';
import { VisuallyHidden } from '@/presentation/components/ui/VisuallyHidden';
import { useContactChannels } from '@/presentation/hooks/useContactChannels';
import { useCopyToClipboard } from '@/presentation/hooks/useCopyToClipboard';
import { UI_TEXT } from '@/shared/constants/uiText';
import { ContactChannelCard } from './ContactChannelCard';
import styles from './ContactChannelGrid.module.css';

interface ContactChannelGridProps {
  /** Si se indica, solo esos canales. */
  readonly kinds?: readonly ContactChannelKind[];
}

/** Directorio de canales (Contáctanos) con un único aviso "Copiado" para lectores de pantalla. */
export function ContactChannelGrid({ kinds }: ContactChannelGridProps): JSX.Element {
  const channels = useContactChannels(kinds);
  const { copiedValue, copy } = useCopyToClipboard();
  const copiedDisplay = channels
    .flatMap((channel) => channel.entries)
    .find((entry) => entry.value === copiedValue)?.display;

  return (
    <>
      <ul className={styles.grid}>
        {channels.map((channel) => (
          <ContactChannelCard
            key={channel.kind}
            channel={channel}
            copiedValue={copiedValue}
            onCopy={(value) => {
              void copy(value);
            }}
          />
        ))}
      </ul>
      <VisuallyHidden>
        <span role="status">
          {copiedDisplay === undefined ? '' : UI_TEXT.contact.copiedAnnouncement(copiedDisplay)}
        </span>
      </VisuallyHidden>
    </>
  );
}
