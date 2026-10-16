import type { JSX, ReactNode } from 'react';
import { Icon } from '../Icon';
import styles from './Accordion.module.css';
import { useAccordionContext, useAccordionItemContext } from './accordionContext';

interface AccordionTriggerProps {
  /** Nivel del encabezado que envuelve el botón, según la jerarquía de la página. */
  readonly headingLevel?: 2 | 3 | 4;
  readonly children: ReactNode;
}

/** Pregunta: botón con `aria-expanded` dentro de un encabezado (patrón WAI-ARIA). */
export function AccordionTrigger({
  headingLevel = 3,
  children,
}: AccordionTriggerProps): JSX.Element {
  const { toggle } = useAccordionContext();
  const { itemId, triggerId, panelId, open } = useAccordionItemContext();
  const Heading = `h${String(headingLevel)}` as 'h2' | 'h3' | 'h4';

  return (
    <Heading className={styles.heading}>
      <button
        type="button"
        id={triggerId}
        className={styles.trigger}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => {
          toggle(itemId);
        }}
      >
        <span>{children}</span>
        <Icon name="chevronDown" weight="bold" className={styles.chevron} />
      </button>
    </Heading>
  );
}
