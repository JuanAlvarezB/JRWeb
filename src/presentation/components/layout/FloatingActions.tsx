import { useSyncExternalStore, type JSX } from 'react';
import { Link } from 'react-router';
import { ActionLink } from '@/presentation/components/ui/ActionLink';
import { Icon } from '@/presentation/components/ui/Icon';
import { VisuallyHidden } from '@/presentation/components/ui/VisuallyHidden';
import { useWhatsAppLink } from '@/presentation/hooks/useWhatsAppLink';
import { ROUTES } from '@/shared/constants/routes';
import { UI_TEXT } from '@/shared/constants/uiText';
import styles from './FloatingActions.module.css';
import {
  markPrivacyNoticeSeen,
  privacyNoticeSeenOnServer,
  subscribeToPrivacyNotice,
  wasPrivacyNoticeSeen,
} from './privacyNoticeStorage';

const { privacyNotice: TEXT } = UI_TEXT;

/**
 * Elementos flotantes (DESIGN.md §5, handoff §2): aviso de privacidad abajo a la
 * izquierda y botón de WhatsApp abajo a la derecha. Comparten un contenedor fijo: en
 * móvil el aviso ocupa el ancho y el botón queda encima de él, sin taparlo.
 */
export function FloatingActions(): JSX.Element {
  const whatsAppHref = useWhatsAppLink();
  // Oculto en el HTML prerenderizado; el navegador, que conoce el registro, decide.
  const noticeVisible = !useSyncExternalStore(
    subscribeToPrivacyNotice,
    wasPrivacyNoticeSeen,
    privacyNoticeSeenOnServer,
  );

  return (
    <div className={styles.floating}>
      {noticeVisible && (
        <section aria-label={TEXT.label} className={styles.notice}>
          <p className={styles.noticeText}>
            {TEXT.textBefore}
            <Link to={ROUTES.dataPolicy}>{TEXT.link}</Link>
            {TEXT.textAfter}
          </p>
          <ActionLink arrow={false} className={styles.dismiss} onClick={markPrivacyNoticeSeen}>
            {TEXT.dismiss}
          </ActionLink>
        </section>
      )}
      <a href={whatsAppHref} target="_blank" rel="noopener noreferrer" className={styles.fab}>
        <Icon name="whatsapp" className={styles.fabIcon} />
        <VisuallyHidden>
          {UI_TEXT.nav.writeWhatsApp} {UI_TEXT.a11y.opensInNewTab}
        </VisuallyHidden>
      </a>
    </div>
  );
}
