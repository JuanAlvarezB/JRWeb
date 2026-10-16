import { useId, type JSX, type ReactNode } from 'react';
import { cx } from '@/shared/utils/cx';
import styles from './Accordion.module.css';
import { AccordionItemContext, useAccordionContext } from './accordionContext';

interface AccordionItemProps {
  /** Identificador estable (p. ej. el id de la pregunta en faq.json). */
  readonly id: string;
  readonly className?: string | undefined;
  readonly children: ReactNode;
}

/** Tarjeta de una pregunta con su respuesta. */
export function AccordionItem({ id, className, children }: AccordionItemProps): JSX.Element {
  const { isOpen } = useAccordionContext();
  const baseId = useId();
  const open = isOpen(id);

  return (
    <AccordionItemContext.Provider
      value={{ itemId: id, triggerId: `${baseId}-trigger`, panelId: `${baseId}-panel`, open }}
    >
      <div className={cx(styles.item, className)} data-state={open ? 'open' : 'closed'}>
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
}
