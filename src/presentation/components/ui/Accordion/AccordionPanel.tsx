import type { JSX, ReactNode } from 'react';
import styles from './Accordion.module.css';
import { useAccordionItemContext } from './accordionContext';

interface AccordionPanelProps {
  readonly children: ReactNode;
}

/** Respuesta. Cerrada, queda en el HTML (útil para SEO) pero oculta con `hidden`. */
export function AccordionPanel({ children }: AccordionPanelProps): JSX.Element {
  const { panelId, open } = useAccordionItemContext();
  return (
    <div id={panelId} className={styles.panel} hidden={!open}>
      {children}
    </div>
  );
}
