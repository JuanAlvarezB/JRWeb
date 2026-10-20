import type { JSX } from 'react';
import { UI_TEXT } from '@/shared/constants/uiText';

/** `horizontal`: logo completo (mín. 240 px). `icon`: logo-ícono (menú compacto y móvil). */
export type LogoVariant = 'horizontal' | 'icon';

/** Archivo y proporción (viewBox) de cada versión del logo en public/assets/brand/. */
const LOGOS: Record<LogoVariant, { src: string; width: number; height: number }> = {
  horizontal: { src: '/assets/brand/logo-horizontal.svg', width: 1290, height: 497 },
  icon: { src: '/assets/brand/logo-icon.svg', width: 1256, height: 495 },
};

interface LogoProps {
  readonly variant: LogoVariant;
  readonly className?: string | undefined;
  /** Vacío cuando el enlace que lo contiene ya tiene nombre accesible. */
  readonly alt?: string;
}

/**
 * Logo de la marca como imagen (se guarda en caché entre páginas). El ancho lo define
 * el CSS; `width`/`height` reservan la proporción para que no haya saltos al cargar.
 */
export function Logo({ variant, className, alt = UI_TEXT.brand.name }: LogoProps): JSX.Element {
  const logo = LOGOS[variant];
  return (
    <img
      src={logo.src}
      width={logo.width}
      height={logo.height}
      alt={alt}
      decoding="async"
      className={className}
    />
  );
}
