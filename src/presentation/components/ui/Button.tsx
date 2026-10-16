import type { JSX } from 'react';
import { cx } from '@/shared/utils/cx';
import styles from './Button.module.css';
import { Icon } from './Icon';
import type { IconName } from './iconRegistry';
import { Pressable, type PressableCommonProps, type PressableTarget } from './Pressable';

export type ButtonVariant = 'primary' | 'outline';
export type ButtonSize = 'default' | 'large';

interface ButtonOwnProps extends PressableCommonProps {
  /** `primary`: único botón con relleno (Verde Sinú). `outline`: acciones secundarias. */
  readonly variant?: ButtonVariant;
  /** `large`: botón destacado de WhatsApp en Contáctanos (60 px). */
  readonly size?: ButtonSize;
  /** Ícono a la izquierda (p. ej. `whatsapp` cuando abre WhatsApp). */
  readonly icon?: IconName | undefined;
  /** Ocupa todo el ancho en móvil (52 px de alto), como en los mockups. */
  readonly fullWidthOnMobile?: boolean;
}

export type ButtonProps = ButtonOwnProps & PressableTarget;

/** Botón de DESIGN.md §5: principal (Verde Sinú) o contorno. */
export function Button({
  variant = 'primary',
  size = 'default',
  icon,
  fullWidthOnMobile = false,
  className,
  children,
  ...rest
}: ButtonProps): JSX.Element {
  return (
    <Pressable
      {...rest}
      className={cx(
        styles.button,
        styles[variant],
        size === 'large' && styles.large,
        fullWidthOnMobile && styles.fullWidthOnMobile,
        className,
      )}
    >
      {icon !== undefined && <Icon name={icon} className={styles.icon} />}
      <span>{children}</span>
    </Pressable>
  );
}
