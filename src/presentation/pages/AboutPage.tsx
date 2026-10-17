import type { JSX } from 'react';
import { CompanyFactsCard } from '@/presentation/components/features/CompanyFactsCard';
import { CtaPanel } from '@/presentation/components/features/CtaPanel';
import { DifferentiatorCards } from '@/presentation/components/features/DifferentiatorCards';
import { StatementCards } from '@/presentation/components/features/StatementCards';
import { Button } from '@/presentation/components/ui/Button';
import { PageHeader } from '@/presentation/components/ui/PageHeader';
import { Section } from '@/presentation/components/ui/Section';
import { VisuallyHidden } from '@/presentation/components/ui/VisuallyHidden';
import { SectionHeading } from '@/presentation/components/ui/SectionHeading';
import { useCompanyInfo } from '@/presentation/hooks/useCompanyInfo';
import { useWhatsAppLink } from '@/presentation/hooks/useWhatsAppLink';
import { usePageMeta } from '@/presentation/seo/usePageMeta';
import { UI_TEXT } from '@/shared/constants/uiText';

const TEXT = UI_TEXT.pages.about;

/** Nosotros (DESIGN.md §8): misión y visión literales, diferenciadores y NIT. */
export default function AboutPage(): JSX.Element {
  usePageMeta('about');
  const { summary } = useCompanyInfo();
  const whatsAppHref = useWhatsAppLink();

  return (
    <>
      <PageHeader title={TEXT.title} lead={summary} />

      <Section labelledBy="mision-vision-titulo">
        <VisuallyHidden as="h2" id="mision-vision-titulo">
          {TEXT.statementsLabel}
        </VisuallyHidden>
        <StatementCards />
      </Section>

      <Section labelledBy="diferencia-titulo">
        <SectionHeading
          id="diferencia-titulo"
          eyebrow={TEXT.differenceEyebrow}
          title={TEXT.differenceTitle}
        />
        <DifferentiatorCards />
        <CompanyFactsCard />
      </Section>

      <Section>
        <CtaPanel variant="plain" title={TEXT.ctaTitle} text={TEXT.ctaText}>
          <Button href={whatsAppHref} newTab icon="whatsapp" fullWidthOnMobile>
            {UI_TEXT.nav.writeWhatsApp}
          </Button>
        </CtaPanel>
      </Section>
    </>
  );
}
