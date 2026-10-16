import { useId, type CSSProperties, type JSX } from 'react';
import { cx } from '@/shared/utils/cx';
import styles from './SpeedometerArc.module.css';
import {
  ARC_GEOMETRY,
  SEGMENTS_ROTATION,
  computeSegmentDashes,
  needlePolygon,
  needleRotation,
  ringPath,
  type NeedlePosition,
} from './speedometerGeometry';

/** Color de cada tramo: los tres del arco de horas o el Verde Sinú del arco completo. */
export type ArcTone = 'theory' | 'workshop' | 'driving' | 'brand';

export interface ArcSegment {
  readonly id: string;
  readonly value: number;
  readonly tone: ArcTone;
}

interface SpeedometerArcProps {
  /** Tramos proporcionales; un solo tramo `brand` dibuja el arco completo. */
  readonly segments: readonly ArcSegment[];
  /** Número del centro (p. ej. "50" o "0"). */
  readonly centerValue: string;
  /** Texto bajo el número (p. ej. "horas en total"). */
  readonly caption?: string | undefined;
  readonly needle: NeedlePosition;
  /** Barrido de la aguja desde cero al montar (hero, primera carga). */
  readonly sweep?: boolean;
  /** Descripción accesible: categoría, total y reparto. */
  readonly label: string;
  readonly className?: string | undefined;
}

const { viewBox, center, radius, strokeWidth, ring, text } = ARC_GEOMETRY;

/**
 * Arco del velocímetro (DESIGN.md §5). La aguja es una capa independiente que se
 * anima con CSS; todo el movimiento se desactiva con "reducir movimiento".
 */
export function SpeedometerArc({
  segments,
  centerValue,
  caption,
  needle,
  sweep = false,
  label,
  className,
}: SpeedometerArcProps): JSX.Element {
  const titleId = useId();
  const dashes = computeSegmentDashes(segments.map((segment) => segment.value));
  const needleStyle = {
    '--needle-rotation': `${String(needleRotation(needle))}deg`,
    '--needle-from': `${String(needleRotation('start'))}deg`,
    '--needle-origin': `${String(center.x)}px ${String(center.y)}px`,
  } as CSSProperties;
  const valueBaseline = caption === undefined ? text.valueBaselineAlone : text.valueBaseline;

  return (
    <svg
      viewBox={`0 0 ${String(viewBox.width)} ${String(viewBox.height)}`}
      role="img"
      aria-labelledby={titleId}
      className={cx(styles.arc, className)}
    >
      <title id={titleId}>{label}</title>
      <g transform={`rotate(${String(SEGMENTS_ROTATION)} ${String(center.x)} ${String(center.y)})`}>
        {segments.map((segment, index) => (
          <circle
            key={segment.id}
            cx={center.x}
            cy={center.y}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            className={cx(styles.segment, styles[segment.tone])}
            style={{
              strokeDasharray: dashes[index]?.dashArray,
              strokeDashoffset: dashes[index]?.dashOffset,
            }}
          />
        ))}
      </g>
      <path
        d={ringPath()}
        className={styles.ring}
        fill="none"
        strokeWidth={ring.strokeWidth}
        strokeDasharray={ring.dashArray}
      />
      <g className={cx(styles.needle, sweep && styles.sweep)} style={needleStyle}>
        <polygon points={needlePolygon()} />
      </g>
      <text
        x={center.x}
        y={valueBaseline}
        textAnchor="middle"
        className={cx(styles.value, caption === undefined && styles.valueAlone)}
      >
        {centerValue}
      </text>
      {caption !== undefined && (
        <text x={center.x} y={text.captionBaseline} textAnchor="middle" className={styles.caption}>
          {caption}
        </text>
      )}
    </svg>
  );
}
