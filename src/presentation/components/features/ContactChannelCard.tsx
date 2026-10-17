import type { JSX } from 'react';
import type { ContactChannelKind } from '@/domain/entities/ContactChannel';
import { ActionLink } from '@/presentation/components/ui/ActionLink';
import { Card } from '@/presentation/components/ui/Card';
import { Icon } from '@/presentation/components/ui/Icon';
import type { IconName } from '@/presentation/components/ui/iconRegistry';
import type { ContactChannelLinks } from '@/presentation/hooks/contactLinks';
import { UI_TEXT } from '@/shared/constants/uiText';
import { cx } from '@/shared/utils/cx';
import styles from './ContactChannelCard.module.css';

const CHANNEL_ICONS: Record<ContactChannelKind, IconName> = {
  whatsapp: 'whatsapp',
  phone: 'phone',
  email: 'mail',
  facebook: 'facebook',
  instagram: 'instagram',
  tiktok: 'tiktok',
};

/** Canales cuyo dato se copia (en las redes basta el enlace). */
const COPYABLE: readonly ContactChannelKind[] = ['whatsapp', 'phone', 'email'];

const { contact: TEXT } = UI_TEXT;

interface ContactChannelCardProps {
  readonly channel: ContactChannelLinks;
  /** Valor copiado en este momento (muestra "Copiado" en ese dato). */
  readonly copiedValue: string | null;
  readonly onCopy: (value: string) => void;
}

/**
 * Tarjeta de canal de contacto (DESIGN.md §5): ícono en círculo Brillo Lima, etiqueta,
 * cada dato con su acción y, en escritorio, "Copiar". En móvil toda la fila es el
 * enlace (handoff §2).
 */
export function ContactChannelCard({
  channel,
  copiedValue,
  onCopy,
}: ContactChannelCardProps): JSX.Element {
  const copyable = COPYABLE.includes(channel.kind);

  return (
    <Card as="li" padding="sm" className={styles.card}>
      <p className={styles.header}>
        <span className={styles.iconCircle}>
          <Icon name={CHANNEL_ICONS[channel.kind]} className={styles.icon} />
        </span>
        <span className={styles.label}>{channel.label}</span>
      </p>
      <ul className={styles.entries}>
        {channel.entries.map((entry) => (
          <li key={entry.value} className={styles.entry}>
            <p className={styles.value}>{entry.display}</p>
            <p className={styles.actions}>
              <ActionLink href={entry.href} newTab={entry.external} className={styles.rowLink}>
                {TEXT.actions[channel.kind]}
              </ActionLink>
              {copyable && (
                <ActionLink
                  arrow={false}
                  ariaLabel={TEXT.copyLabel(entry.display)}
                  className={cx(styles.copy, copiedValue === entry.value && styles.copied)}
                  onClick={() => {
                    onCopy(entry.value);
                  }}
                >
                  {copiedValue === entry.value ? TEXT.copied : TEXT.copy}
                </ActionLink>
              )}
            </p>
          </li>
        ))}
      </ul>
    </Card>
  );
}
