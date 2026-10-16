import { useState, type JSX, type ReactNode } from 'react';
import { cx } from '@/shared/utils/cx';
import styles from './Accordion.module.css';
import { AccordionContext, type AccordionContextValue } from './accordionContext';

interface AccordionRootProps {
  /** Elementos abiertos al cargar (p. ej. la primera pregunta). */
  readonly defaultOpen?: readonly string[];
  readonly className?: string | undefined;
  readonly children: ReactNode;
}

/** Contenedor del acordeón. Permite varios elementos abiertos a la vez (handoff §2). */
export function AccordionRoot({
  defaultOpen = [],
  className,
  children,
}: AccordionRootProps): JSX.Element {
  const [openIds, setOpenIds] = useState<ReadonlySet<string>>(() => new Set(defaultOpen));

  const value: AccordionContextValue = {
    isOpen: (itemId) => openIds.has(itemId),
    toggle: (itemId) => {
      setOpenIds((current) => {
        const next = new Set(current);
        if (next.has(itemId)) next.delete(itemId);
        else next.add(itemId);
        return next;
      });
    },
  };

  return (
    <AccordionContext.Provider value={value}>
      <div className={cx(styles.root, className)}>{children}</div>
    </AccordionContext.Provider>
  );
}
