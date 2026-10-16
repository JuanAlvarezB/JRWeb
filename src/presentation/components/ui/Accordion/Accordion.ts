import { AccordionItem } from './AccordionItem';
import { AccordionPanel } from './AccordionPanel';
import { AccordionRoot } from './AccordionRoot';
import { AccordionTrigger } from './AccordionTrigger';

/**
 * Acordeón con el patrón Compound Components:
 *
 * ```tsx
 * <Accordion defaultOpen={['edad']}>
 *   <Accordion.Item id="edad">
 *     <Accordion.Trigger>¿Desde qué edad…?</Accordion.Trigger>
 *     <Accordion.Panel>…</Accordion.Panel>
 *   </Accordion.Item>
 * </Accordion>
 * ```
 *
 * Las piezas comparten estado por contexto, así la página compone el contenido
 * libremente (respuestas con links de acción) sin pasar props en cadena.
 */
export const Accordion = Object.assign(AccordionRoot, {
  Item: AccordionItem,
  Trigger: AccordionTrigger,
  Panel: AccordionPanel,
});
