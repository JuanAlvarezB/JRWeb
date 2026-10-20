import type { JSX } from 'react';
import { CtaPanel } from '@/presentation/components/features/CtaPanel';
import { ServiceList } from '@/presentation/components/features/ServiceList';
import { Button } from '@/presentation/components/ui/Button';
import { PageHeader } from '@/presentation/components/ui/PageHeader';
import { Section } from '@/presentation/components/ui/Section';
import { ROUTES } from '@/shared/constants/routes';
import { usePageMeta } from '@/presentation/seo/usePageMeta';
import { UI_TEXT } from '@/shared/constants/uiText';

const TEXT = UI_TEXT.pages.services;

/** Servicios (DESIGN.md §8): un bloque por categoría y el paso a Planes. */
export default function ServicesPage(): JSX.Element {
  usePageMeta('services');
  return (
    <>
      <PageHeader title={TEXT.title} lead={TEXT.lead} />

      <Section label={TEXT.title}>
        <ServiceList />
      </Section>

      <Section>
        <CtaPanel variant="row" title={TEXT.ctaTitle} text={TEXT.ctaText}>
          <Button to={ROUTES.plans} variant="outline">
            {TEXT.ctaAction}
          </Button>
        </CtaPanel>
      </Section>
    </>
  );
}
