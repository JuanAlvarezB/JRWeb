import type { JSX } from 'react';
import { BenefitHighlights } from '@/presentation/components/features/BenefitHighlights';
import { CourseHoursExplorer } from '@/presentation/components/features/CourseHoursExplorer';
import { HeroFloatingCards } from '@/presentation/components/features/HeroFloatingCards';
import { LocationBlock } from '@/presentation/components/features/LocationBlock';
import { PlanGrid } from '@/presentation/components/features/PlanGrid';
import { ServiceSummaryList } from '@/presentation/components/features/ServiceSummaryList';
import { TestimonialsGrid } from '@/presentation/components/features/TestimonialsGrid';
import { ActionLink } from '@/presentation/components/ui/ActionLink';
import { Button } from '@/presentation/components/ui/Button';
import { Ribbon } from '@/presentation/components/ui/Ribbon';
import { Section } from '@/presentation/components/ui/Section';
import { SectionHeading } from '@/presentation/components/ui/SectionHeading';
import { useSchoolLocation } from '@/presentation/hooks/useSchoolLocation';
import { useTestimonials } from '@/presentation/hooks/useTestimonials';
import { useWhatsAppLink } from '@/presentation/hooks/useWhatsAppLink';
import { ROUTES, SECTION_IDS } from '@/shared/constants/routes';
import { UI_TEXT } from '@/shared/constants/uiText';
import styles from './HomePage.module.css';

const TEXT = UI_TEXT.pages.home;

/**
 * Inicio (DESIGN.md §8): el orden responde a las dudas del cliente: ¿son confiables?,
 * ¿qué tengo que hacer?, ¿qué incluye?, ¿dónde quedan?
 */
export default function HomePage(): JSX.Element {
  const whatsAppHref = useWhatsAppLink();
  const { testimonials } = useTestimonials();
  const { address } = useSchoolLocation();

  return (
    <>
      <title>{TEXT.documentTitle}</title>

      <Section labelledBy="inicio-titulo">
        <HeroFloatingCards>
          <Ribbon className={styles.ribbon}>{UI_TEXT.brand.tagline}</Ribbon>
          <h1 id="inicio-titulo" className={styles.title}>
            {TEXT.title}
          </h1>
          <p className={styles.lead}>{TEXT.lead}</p>
          <div className={styles.heroActions}>
            <Button href={whatsAppHref} newTab icon="whatsapp" fullWidthOnMobile>
              {UI_TEXT.nav.writeWhatsApp}
            </Button>
            <ActionLink to={ROUTES.plans}>{TEXT.seePlans}</ActionLink>
          </div>
        </HeroFloatingCards>
      </Section>

      <Section labelledBy="beneficios-titulo">
        <SectionHeading
          id="beneficios-titulo"
          eyebrow={TEXT.benefitsEyebrow}
          title={TEXT.benefitsTitle}
        />
        <BenefitHighlights />
      </Section>

      <Section labelledBy="horas-titulo">
        <SectionHeading
          id="horas-titulo"
          eyebrow={TEXT.hoursEyebrow}
          title={TEXT.hoursTitle}
          subtitle={TEXT.hoursSubtitle}
        />
        <CourseHoursExplorer />
      </Section>

      <Section labelledBy="planes-titulo">
        <SectionHeading
          id="planes-titulo"
          eyebrow={TEXT.plansEyebrow}
          title={TEXT.plansTitle}
          subtitle={TEXT.plansSubtitle}
        />
        <PlanGrid variant="summary" />
        <ActionLink to={ROUTES.plans} className={styles.centered}>
          {TEXT.plansLink}
        </ActionLink>
      </Section>

      <Section labelledBy="servicios-titulo" width="reading">
        <SectionHeading
          id="servicios-titulo"
          eyebrow={TEXT.servicesEyebrow}
          title={TEXT.servicesTitle}
          align="start"
        />
        <ServiceSummaryList />
        <ActionLink to={ROUTES.services} className={styles.start}>
          {UI_TEXT.services.seeAll}
        </ActionLink>
      </Section>

      {testimonials.length > 0 && (
        <Section labelledBy="testimonios-titulo">
          <SectionHeading
            id="testimonios-titulo"
            eyebrow={TEXT.testimonialsEyebrow}
            title={TEXT.testimonialsTitle}
          />
          <TestimonialsGrid />
        </Section>
      )}

      <Section id={SECTION_IDS.location} labelledBy="ubicacion-titulo">
        <SectionHeading
          id="ubicacion-titulo"
          eyebrow={TEXT.locationEyebrow}
          title={TEXT.locationTitle(address.city)}
        />
        <LocationBlock details="schedule" />
      </Section>
    </>
  );
}
