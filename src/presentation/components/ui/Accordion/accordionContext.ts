import { createContext, useContext } from 'react';

/** Estado compartido por todos los elementos del acordeón. */
export interface AccordionContextValue {
  readonly isOpen: (itemId: string) => boolean;
  readonly toggle: (itemId: string) => void;
}

/** Datos de un elemento: su estado y los IDs que enlazan pregunta y respuesta. */
export interface AccordionItemContextValue {
  readonly itemId: string;
  readonly triggerId: string;
  readonly panelId: string;
  readonly open: boolean;
}

export const AccordionContext = createContext<AccordionContextValue | null>(null);
export const AccordionItemContext = createContext<AccordionItemContextValue | null>(null);

export function useAccordionContext(): AccordionContextValue {
  const context = useContext(AccordionContext);
  if (context === null) {
    throw new Error('Accordion.Item debe estar dentro de <Accordion>.');
  }
  return context;
}

export function useAccordionItemContext(): AccordionItemContextValue {
  const context = useContext(AccordionItemContext);
  if (context === null) {
    throw new Error('Accordion.Trigger y Accordion.Panel deben estar dentro de <Accordion.Item>.');
  }
  return context;
}
