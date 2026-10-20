import type { JSX } from 'react';
import type { Faq, FaqAction } from '@/domain/entities/Faq';
import { Accordion } from '@/presentation/components/ui/Accordion/Accordion';
import { ActionLink } from '@/presentation/components/ui/ActionLink';
import type { PressableTarget } from '@/presentation/components/ui/Pressable';
import { useSchoolLocation } from '@/presentation/hooks/useSchoolLocation';
import { useWhatsAppLink } from '@/presentation/hooks/useWhatsAppLink';
import { ROUTES } from '@/shared/constants/routes';
import styles from './FaqAccordion.module.css';

interface FaqAccordionProps {
  readonly faqs: readonly Faq[];
  /** Preguntas abiertas al cargar (en el mockup de Planes, la del precio). */
  readonly defaultOpen?: readonly string[];
  /** Nivel de encabezado de las preguntas según la página. */
  readonly headingLevel?: 2 | 3 | 4;
}

/**
 * Preguntas frecuentes en acordeón (DESIGN.md §5): varias abiertas a la vez y, si la
 * respuesta tiene acción, su link (WhatsApp, cómo llegar o la página de planes).
 */
export function FaqAccordion({
  faqs,
  defaultOpen = [],
  headingLevel = 3,
}: FaqAccordionProps): JSX.Element {
  const whatsAppHref = useWhatsAppLink();
  const { directionsUrl } = useSchoolLocation();

  function actionTarget(action: FaqAction): PressableTarget {
    switch (action.kind) {
      case 'whatsapp':
        return { href: whatsAppHref, newTab: true };
      case 'directions':
        return { href: directionsUrl, newTab: true };
      case 'plans':
        return { to: ROUTES.plans };
    }
  }

  return (
    <Accordion defaultOpen={defaultOpen} className={styles.accordion}>
      {faqs.map((faq) => (
        <Accordion.Item key={faq.id} id={faq.id}>
          <Accordion.Trigger headingLevel={headingLevel}>{faq.question}</Accordion.Trigger>
          <Accordion.Panel>
            <p>{faq.answer}</p>
            {faq.action !== undefined && (
              <ActionLink {...actionTarget(faq.action)} className={styles.action}>
                {faq.action.label}
              </ActionLink>
            )}
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}
