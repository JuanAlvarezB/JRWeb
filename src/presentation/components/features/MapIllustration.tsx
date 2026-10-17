import type { JSX } from 'react';
import { cx } from '@/shared/utils/cx';
import styles from './MapIllustration.module.css';

/** Manzanas del plano: x, y, ancho y alto en el lienzo de 400 × 260. */
const BLOCKS: readonly (readonly [number, number, number, number])[] = [
  [4, 6, 88, 66],
  [108, 6, 118, 66],
  [242, 6, 154, 66],
  [4, 90, 88, 70],
  [108, 90, 118, 70],
  [242, 90, 76, 70],
  [334, 90, 62, 70],
  [4, 178, 88, 76],
  [108, 178, 118, 76],
  [242, 178, 154, 76],
];

/** Punta del pin: sobre la calle, frente a la sede. */
const PIN = { x: 200, y: 84 } as const;

interface MapIllustrationProps {
  readonly className?: string | undefined;
}

/**
 * Plano ilustrado de la sede (manzanas, calles y pin), como en los mockups. No es un
 * mapa real: es la fachada liviana que se muestra antes de cargar Google Maps y la
 * miniatura de la tarjeta del hero. Es decorativo; la dirección va en texto al lado.
 * Se recorta desde abajo para que el pin, cerca del borde superior, siempre se vea.
 */
export function MapIllustration({ className }: MapIllustrationProps): JSX.Element {
  return (
    <svg
      viewBox="0 0 400 260"
      preserveAspectRatio="xMidYMin slice"
      className={cx(styles.map, className)}
      aria-hidden="true"
      focusable="false"
    >
      <rect width="400" height="260" className={styles.street} />
      {BLOCKS.map(([x, y, width, height]) => (
        <rect
          key={`${String(x)}-${String(y)}`}
          x={x}
          y={y}
          width={width}
          height={height}
          rx="6"
          className={styles.block}
        />
      ))}
      <ellipse cx={PIN.x} cy={PIN.y + 2} rx="9" ry="3" className={styles.pinShadow} />
      <path
        d={`M${String(PIN.x)} ${String(PIN.y)}c-9-11-16-19-16-28a16 16 0 0 1 32 0c0 9-7 17-16 28z`}
        className={styles.pin}
      />
      <circle cx={PIN.x} cy={PIN.y - 29} r="5.5" className={styles.pinDot} />
    </svg>
  );
}
