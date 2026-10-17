import type { JSX, ReactNode } from 'react';
import { BenefitHighlights } from '@/presentation/components/features/BenefitHighlights';
import { CompanyFactsCard } from '@/presentation/components/features/CompanyFactsCard';
import { ContactChannelGrid } from '@/presentation/components/features/ContactChannelGrid';
import { CourseHoursExplorer } from '@/presentation/components/features/CourseHoursExplorer';
import { DifferentiatorCards } from '@/presentation/components/features/DifferentiatorCards';
import { FaqAccordion } from '@/presentation/components/features/FaqAccordion';
import { HeroFloatingCards } from '@/presentation/components/features/HeroFloatingCards';
import { LocationBlock } from '@/presentation/components/features/LocationBlock';
import { PlanGrid } from '@/presentation/components/features/PlanGrid';
import { ScheduleCards } from '@/presentation/components/features/ScheduleCards';
import { ServiceList } from '@/presentation/components/features/ServiceList';
import { ServiceSummaryList } from '@/presentation/components/features/ServiceSummaryList';
import { StatementCards } from '@/presentation/components/features/StatementCards';
import { TestimonialsGrid } from '@/presentation/components/features/TestimonialsGrid';
import { ActionLink } from '@/presentation/components/ui/ActionLink';
import { Button } from '@/presentation/components/ui/Button';
import { Ribbon } from '@/presentation/components/ui/Ribbon';
import { SectionHeading } from '@/presentation/components/ui/SectionHeading';
import { useFaqs } from '@/presentation/hooks/useFaqs';
import { useWhatsAppLink } from '@/presentation/hooks/useWhatsAppLink';
import styles from './FeaturePreview.module.css';

/**
 * Vista previa de las features (solo DEV, http://localhost:5173/features), en el orden
 * de las páginas, para compararlas con docs/mockups/. Los textos de sección son los de
 * los mockups; las páginas reales los tendrán en la etapa de páginas.
 */

function Section({
  id,
  children,
}: {
  readonly id: string;
  readonly children: ReactNode;
}): JSX.Element {
  return (
    <section id={id} className={styles.section} data-preview={id}>
      {children}
    </section>
  );
}

function PlansFaq(): JSX.Element {
  return <FaqAccordion faqs={useFaqs({ page: 'plans' })} defaultOpen={['precio']} />;
}

export default function FeaturePreview(): JSX.Element {
  const whatsAppHref = useWhatsAppLink();

  return (
    <main className={styles.preview}>
      <Section id="hero">
        <HeroFloatingCards>
          <Ribbon>Centro de Enseñanza Automovilística</Ribbon>
          <h1 className={styles.h1}>Aprende a conducir con confianza en Cereté</h1>
          <p className={styles.lead}>
            Cursos para licencias A2, B1 y C1 con instructores certificados. Clases teóricas de día
            o de noche y prácticas de lunes a sábado.
          </p>
          <div className={styles.heroActions}>
            <Button href={whatsAppHref} newTab icon="whatsapp" fullWidthOnMobile>
              Escríbenos por WhatsApp
            </Button>
            <ActionLink to="/planes">Ver planes</ActionLink>
          </div>
        </HeroFloatingCards>
      </Section>

      <Section id="beneficios">
        <SectionHeading eyebrow="Por qué J&R" title="Por qué estudiar con nosotros" />
        <BenefitHighlights />
      </Section>

      <Section id="horas">
        <SectionHeading
          eyebrow="Tu curso en horas"
          title="Así se reparten tus horas de clase"
          subtitle="Elige tu categoría y mira cuántas horas son de teoría, de taller y de manejo."
        />
        <CourseHoursExplorer />
      </Section>

      <Section id="planes-inicio">
        <SectionHeading
          eyebrow="Planes"
          title="Elige tu licencia"
          subtitle="Escríbenos y te enviamos el precio y las promociones vigentes."
        />
        <PlanGrid variant="summary" />
      </Section>

      <Section id="servicios-inicio">
        <SectionHeading eyebrow="Servicios" title="Un curso para cada vehículo" align="start" />
        <ServiceSummaryList />
        <ActionLink to="/servicios">Ver servicios</ActionLink>
      </Section>

      <Section id="testimonios">
        <TestimonialsGrid
          header={<SectionHeading eyebrow="Testimonios" title="Lo que dicen de nosotros" />}
        />
      </Section>

      <Section id="ubicacion-inicio">
        <SectionHeading eyebrow="Visítanos" title="Estamos en Cereté" />
        <LocationBlock details="schedule" />
      </Section>

      <Section id="mision">
        <StatementCards />
      </Section>

      <Section id="diferencia">
        <SectionHeading
          eyebrow="Lo que nos diferencia"
          title="Instructores certificados y horarios que se ajustan a ti"
        />
        <DifferentiatorCards />
        <CompanyFactsCard />
      </Section>

      <Section id="servicios">
        <ServiceList />
      </Section>

      <Section id="planes">
        <PlanGrid variant="detailed" />
        <SectionHeading eyebrow="Preguntas sobre los planes" title="Antes de elegir tu curso" />
        <PlansFaq />
      </Section>

      <Section id="contacto">
        <SectionHeading title="Todos nuestros canales" />
        <ContactChannelGrid />
        <SectionHeading title="Cómo llegar a la sede" />
        <LocationBlock details="googleName" />
        <SectionHeading title="Horarios de clases" />
        <ScheduleCards />
      </Section>
    </main>
  );
}
