import type { JSX } from 'react';
import { ContactChannelGrid } from '@/presentation/components/features/ContactChannelGrid';
import { LocationBlock } from '@/presentation/components/features/LocationBlock';
import { ScheduleCards } from '@/presentation/components/features/ScheduleCards';
import { Button } from '@/presentation/components/ui/Button';
import { PageHeader } from '@/presentation/components/ui/PageHeader';
import { Section } from '@/presentation/components/ui/Section';
import { SectionHeading } from '@/presentation/components/ui/SectionHeading';
import { useWhatsAppLink } from '@/presentation/hooks/useWhatsAppLink';
import { SECTION_IDS } from '@/shared/constants/routes';
import { usePageMeta } from '@/presentation/seo/usePageMeta';
import { UI_TEXT } from '@/shared/constants/uiText';

const TEXT = UI_TEXT.pages.contact;

/** Contáctanos (DESIGN.md §8): WhatsApp grande, canales, ubicación y horarios. */
export default function ContactPage(): JSX.Element {
  usePageMeta('contact');
  const whatsAppHref = useWhatsAppLink();

  return (
    <>
      <PageHeader title={TEXT.title} lead={TEXT.lead}>
        <Button href={whatsAppHref} newTab icon="whatsapp" size="large" fullWidthOnMobile>
          {UI_TEXT.nav.writeWhatsApp}
        </Button>
      </PageHeader>

      <Section labelledBy="canales-titulo">
        <SectionHeading id="canales-titulo" title={TEXT.channelsTitle} />
        <ContactChannelGrid />
      </Section>

      <Section id={SECTION_IDS.location} labelledBy="ubicacion-titulo">
        <SectionHeading id="ubicacion-titulo" title={TEXT.locationTitle} />
        <LocationBlock details="googleName" />
      </Section>

      <Section id={SECTION_IDS.schedules} labelledBy="horarios-titulo">
        <SectionHeading id="horarios-titulo" title={TEXT.schedulesTitle} />
        <ScheduleCards />
      </Section>
    </>
  );
}
