import type { JSX } from 'react';
import { CtaPanel } from '@/presentation/components/features/CtaPanel';
import { FaqAccordion } from '@/presentation/components/features/FaqAccordion';
import { Button } from '@/presentation/components/ui/Button';
import { PageHeader } from '@/presentation/components/ui/PageHeader';
import { Section } from '@/presentation/components/ui/Section';
import { useFaqGroups } from '@/presentation/hooks/useFaqs';
import { useWhatsAppLink } from '@/presentation/hooks/useWhatsAppLink';
import { usePageMeta } from '@/presentation/seo/usePageMeta';
import { UI_TEXT } from '@/shared/constants/uiText';
import styles from './FaqPage.module.css';

const TEXT = UI_TEXT.pages.faq;

/** Preguntas frecuentes (DESIGN.md §8): acordeón agrupado por tema y cierre por WhatsApp. */
export default function FaqPage(): JSX.Element {
  usePageMeta('faq');
  const groups = useFaqGroups();
  const whatsAppHref = useWhatsAppLink();
  const firstQuestion = groups[0]?.faqs[0]?.id;

  return (
    <>
      <PageHeader title={TEXT.title} lead={TEXT.lead} />

      {groups.map((group, index) => {
        const titleId = `preguntas-${group.topic}`;
        return (
          <Section key={group.topic} labelledBy={titleId} className={styles.group}>
            <h2 id={titleId} className={styles.topic}>
              {UI_TEXT.faqTopics[group.topic]}
            </h2>
            <FaqAccordion
              faqs={group.faqs}
              defaultOpen={index === 0 && firstQuestion !== undefined ? [firstQuestion] : []}
            />
          </Section>
        );
      })}

      <Section>
        <CtaPanel variant="card" title={TEXT.ctaTitle} text={TEXT.ctaText}>
          <Button href={whatsAppHref} newTab icon="whatsapp" fullWidthOnMobile>
            {UI_TEXT.nav.writeWhatsApp}
          </Button>
        </CtaPanel>
      </Section>
    </>
  );
}
