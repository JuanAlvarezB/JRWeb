import type { JSX, ReactNode } from 'react';
import { Link } from 'react-router';
import { UI_TEXT } from '@/shared/constants/uiText';
import { VisuallyHidden } from './VisuallyHidden';

/**
 * Destino de un elemento interactivo. Exactamente uno:
 * - `to`: ruta interna (React Router, navegación sin recargar).
 * - `href`: enlace externo o de protocolo (wa.me, tel:, mailto:, mapas).
 * - `onClick`: acción en la página (se renderiza un `<button>`).
 */
export type PressableTarget =
  | {
      readonly to: string;
      readonly href?: never;
      readonly onClick?: never;
      readonly newTab?: never;
    }
  | {
      readonly href: string;
      readonly to?: never;
      readonly onClick?: never;
      /** Abre en otra pestaña y lo anuncia a lectores de pantalla. */
      readonly newTab?: boolean;
    }
  | {
      readonly onClick: () => void;
      readonly to?: never;
      readonly href?: never;
      readonly newTab?: never;
    };

export interface PressableCommonProps {
  readonly className?: string | undefined;
  readonly children: ReactNode;
  /** Nombre accesible cuando el contenido visible no lo da (p. ej. solo ícono). */
  readonly ariaLabel?: string | undefined;
  readonly testId?: string | undefined;
}

export type PressableProps = PressableCommonProps & PressableTarget;

/**
 * Elemento interactivo base: elige `<Link>`, `<a>` o `<button>` según el destino.
 * Button y ActionLink lo componen para no repetir esta lógica.
 */
export function Pressable(props: PressableProps): JSX.Element {
  const { className, children, ariaLabel, testId } = props;
  const common = { className, 'aria-label': ariaLabel, 'data-testid': testId };

  if (props.to !== undefined) {
    return (
      <Link to={props.to} {...common}>
        {children}
      </Link>
    );
  }

  if (props.href !== undefined) {
    const newTab = props.newTab === true;
    return (
      <a
        href={props.href}
        target={newTab ? '_blank' : undefined}
        rel={newTab ? 'noopener noreferrer' : undefined}
        {...common}
      >
        {children}
        {newTab && <VisuallyHidden> {UI_TEXT.a11y.opensInNewTab}</VisuallyHidden>}
      </a>
    );
  }

  return (
    <button type="button" onClick={props.onClick} {...common}>
      {children}
    </button>
  );
}
