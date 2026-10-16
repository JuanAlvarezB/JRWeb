import type { JSX } from 'react';
import { cx } from '@/shared/utils/cx';
import styles from './Icon.module.css';
import {
  BRAND_ICONS,
  ICON_STROKE_WIDTH,
  LINE_ICONS,
  isBrandIcon,
  type IconName,
} from './iconRegistry';

const VIEWBOX = '0 0 24 24';

interface IconProps {
  readonly name: IconName;
  readonly className?: string | undefined;
  /** Si se indica, el ícono se anuncia con este nombre; si no, es decorativo. */
  readonly label?: string | undefined;
  readonly weight?: keyof typeof ICON_STROKE_WIDTH;
}

/**
 * Ícono del sistema. Por defecto es decorativo (`aria-hidden`) y su color es el
 * del texto (`currentColor`). El tamaño lo define el componente que lo usa.
 */
export function Icon({ name, className, label, weight = 'regular' }: IconProps): JSX.Element {
  const a11y =
    label === undefined
      ? { 'aria-hidden': true as const }
      : { role: 'img' as const, 'aria-label': label };
  const strokeWidth = ICON_STROKE_WIDTH[weight];

  if (isBrandIcon(name)) {
    const glyph = BRAND_ICONS[name];
    return (
      <svg
        viewBox={VIEWBOX}
        className={cx(styles.icon, className)}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        focusable="false"
        {...a11y}
      >
        {glyph.paths.map((path) => (
          <path key={path} d={path} />
        ))}
      </svg>
    );
  }

  const LineIcon = LINE_ICONS[name];
  return (
    <LineIcon
      className={cx(styles.icon, className)}
      strokeWidth={strokeWidth}
      focusable="false"
      {...a11y}
    />
  );
}
