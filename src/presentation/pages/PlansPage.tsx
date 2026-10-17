import type { JSX } from 'react';
import { FaqAccordion } from '@/presentation/components/features/FaqAccordion';
import { PlanGrid } from '@/presentation/components/features/PlanGrid';
import { PageHeader } from '@/presentation/components/ui/PageHeader';
import { Section } from '@/presentation/components/ui/Section';
import { SectionHeading } from '@/presentation/components/ui/SectionHeading';
import { useFaqs } from '@/presentation/hooks/useFaqs';
import { UI_TEXT } from '@/shared/constants/uiText';

const TEXT = UI_TEXT.pages.plans;

/** Pregunta abierta al cargar, como en el mockup: la del precio. */
const OPEN_FAQ = ['precio'];

/** Planes (DESIGN.md §8): tres tarjetas con el desglose de horas, sin precio. */
export default function PlansPage(): JSX.Element {
  const faqs = useFaqs({ page: 'plans' });

  return (
    <>
      <title>{UI_TEXT.pages.documentTitle(TEXT.title)}</title>
      <PageHeader title={TEXT.title} lead={TEXT.lead} />

      <Section label={TEXT.title}>
        <PlanGrid variant="detailed" />
      </Section>

      {faqs.length > 0 && (
        <Section labelledBy="planes-preguntas">
          <SectionHeading id="planes-preguntas" eyebrow={TEXT.faqEyebrow} title={TEXT.faqTitle} />
          <FaqAccordion faqs={faqs} defaultOpen={OPEN_FAQ} />
        </Section>
      )}
    </>
  );
}
