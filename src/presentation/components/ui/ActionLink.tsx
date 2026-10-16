import type { JSX } from 'react';
import { cx } from '@/shared/utils/cx';
import styles from './ActionLink.module.css';
import { Icon } from './Icon';
import type { IconName } from './iconRegistry';
import { Pressable, type PressableCommonProps, type PressableTarget } from './Pressable';

interface ActionLinkOwnProps extends PressableCommonProps {
  /** Flecha → al final (por defecto). "Entendido" y "Copiar" van sin flecha. */
  readonly arrow?: boolean;
  /** Ícono opcional antes del texto (p. ej. `copy`). */
  readonly icon?: IconName | undefined;
}

export type ActionLinkProps = ActionLinkOwnProps & PressableTarget;

/**
 * Link de acción de DESIGN.md §5: Verde Sinú, Barlow 600, flecha y subrayado en hover.
 * La flecha es un ícono (Barlow no incluye el carácter "→" en el subconjunto latino).
 */
export function ActionLink({
  arrow = true,
  icon,
  className,
  children,
  ...rest
}: ActionLinkProps): JSX.Element {
  return (
    <Pressable {...rest} className={cx(styles.actionLink, className)}>
      {icon !== undefined && <Icon name={icon} className={styles.leadingIcon} />}
      <span className={styles.label}>{children}</span>
      {arrow && <Icon name="arrowRight" weight="bold" className={styles.arrow} />}
    </Pressable>
  );
}
