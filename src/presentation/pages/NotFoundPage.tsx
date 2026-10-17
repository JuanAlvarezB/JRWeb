import type { JSX } from 'react';
import { SpeedometerArc } from '@/presentation/components/brand/SpeedometerArc';
import { ActionLink } from '@/presentation/components/ui/ActionLink';
import { Button } from '@/presentation/components/ui/Button';
import { useWhatsAppLink } from '@/presentation/hooks/useWhatsAppLink';
import { ROUTES } from '@/shared/constants/routes';
import { UI_TEXT } from '@/shared/constants/uiText';
import styles from './NotFoundPage.module.css';

const TEXT = UI_TEXT.pages.notFound;
const FULL_ARC = [{ id: 'arc', value: 1, tone: 'brand' }] as const;

/** 404 (DESIGN.md §8): el velocímetro con la aguja en cero y el camino de vuelta. */
export default function NotFoundPage(): JSX.Element {
  const whatsAppHref = useWhatsAppLink();

  return (
    <>
      <title>{UI_TEXT.pages.documentTitle(TEXT.documentTitle)}</title>
      <div className={styles.page}>
        <SpeedometerArc
          segments={FULL_ARC}
          centerValue="0"
          needle="start"
          label={TEXT.arcLabel}
          className={styles.arc}
        />
        <h1 className={styles.title}>{TEXT.title}</h1>
        <p className={styles.lead}>{TEXT.lead}</p>
        <div className={styles.actions}>
          <Button to={ROUTES.home} fullWidthOnMobile>
            {TEXT.home}
          </Button>
          <ActionLink href={whatsAppHref} newTab>
            {UI_TEXT.nav.writeWhatsApp}
          </ActionLink>
        </div>
      </div>
    </>
  );
}
