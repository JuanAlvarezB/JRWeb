/**
 * Geometría del arco del velocímetro (handoff §2, "Arco del velocímetro").
 * Ángulos matemáticos: grados en sentido antihorario desde el eje +x.
 * El arco va de 210° a −30° (240°), pasando por arriba.
 */
export const ARC_GEOMETRY = {
  viewBox: { width: 320, height: 250 },
  center: { x: 160, y: 160 },
  radius: 130,
  strokeWidth: 24,
  startAngle: 210,
  sweep: 240,
  /** Hueco entre tramos, en grados. */
  gap: 3,
  ring: { radius: 100, strokeWidth: 8, dashArray: '5 9' },
  needle: { innerRadius: 76, outerRadius: 116, halfWidth: 6 },
  text: { valueBaseline: 172, valueBaselineAlone: 176, captionBaseline: 196 },
} as const;

const DECIMALS = 2;
const FULL_TURN = 360;

export interface Point {
  readonly x: number;
  readonly y: number;
}

/** Trazo de un tramo dibujado sobre un círculo con `stroke-dasharray`. */
export interface SegmentDash {
  readonly dashArray: string;
  readonly dashOffset: number;
}

function round(value: number): number {
  const factor = 10 ** DECIMALS;
  return Math.round(value * factor) / factor;
}

/** Circunferencia del círculo donde se dibujan los tramos. */
export function arcCircumference(): number {
  return 2 * Math.PI * ARC_GEOMETRY.radius;
}

/** Punto SVG (y hacia abajo) a un radio y ángulo matemático dados. */
export function polarToCartesian(radius: number, angleDeg: number): Point {
  const radians = (angleDeg * Math.PI) / 180;
  return {
    x: round(ARC_GEOMETRY.center.x + radius * Math.cos(radians)),
    y: round(ARC_GEOMETRY.center.y - radius * Math.sin(radians)),
  };
}

/**
 * Rotación (en grados de pantalla, sentido horario) que lleva el inicio del trazo
 * de un `<circle>` (que empieza en +x) al inicio del arco.
 */
export const SEGMENTS_ROTATION = FULL_TURN - ARC_GEOMETRY.startAngle;

/**
 * Reparte el arco entre los valores de forma proporcional, con un hueco de 3°
 * entre tramos visibles. Los valores en cero quedan invisibles (longitud 0), así
 * el número de tramos no cambia y la transición entre categorías es suave.
 *
 * @param values - Horas de cada tramo (p. ej. teoría, taller y manejo).
 */
export function computeSegmentDashes(values: readonly number[]): SegmentDash[] {
  const circumference = arcCircumference();
  const visible = values.filter((value) => value > 0);
  const total = visible.reduce((sum, value) => sum + value, 0);
  const available = ARC_GEOMETRY.sweep - ARC_GEOMETRY.gap * Math.max(visible.length - 1, 0);
  const toLength = (angle: number): number => (angle / FULL_TURN) * circumference;

  let startAngle = 0;
  return values.map((value) => {
    if (value <= 0 || total === 0) {
      return {
        dashArray: `0 ${String(round(circumference))}`,
        dashOffset: round(-toLength(startAngle)),
      };
    }
    const angle = (available * value) / total;
    const dash: SegmentDash = {
      dashArray: `${String(round(toLength(angle)))} ${String(round(circumference))}`,
      dashOffset: round(-toLength(startAngle)),
    };
    startAngle += angle + ARC_GEOMETRY.gap;
    return dash;
  });
}

/** Trayectoria del anillo interno punteado: el mismo recorrido de 240°. */
export function ringPath(): string {
  const { radius } = ARC_GEOMETRY.ring;
  const start = polarToCartesian(radius, ARC_GEOMETRY.startAngle);
  const end = polarToCartesian(radius, ARC_GEOMETRY.startAngle - ARC_GEOMETRY.sweep);
  const largeArc = ARC_GEOMETRY.sweep > FULL_TURN / 2 ? 1 : 0;
  return `M ${String(start.x)} ${String(start.y)} A ${String(radius)} ${String(radius)} 0 ${String(largeArc)} 1 ${String(end.x)} ${String(end.y)}`;
}

/** Triángulo de la aguja apuntando a +x; se gira con CSS alrededor del centro. */
export function needlePolygon(): string {
  const { center, needle } = ARC_GEOMETRY;
  const points: readonly Point[] = [
    { x: center.x + needle.innerRadius, y: center.y - needle.halfWidth },
    { x: center.x + needle.outerRadius, y: center.y },
    { x: center.x + needle.innerRadius, y: center.y + needle.halfWidth },
  ];
  return points.map((point) => `${String(point.x)},${String(point.y)}`).join(' ');
}

/** Posición de la aguja: `start` = cero (404); `end` = curso completo. */
export type NeedlePosition = 'start' | 'end';

/** Rotación CSS (grados, sentido horario) para la posición de la aguja. */
export function needleRotation(position: NeedlePosition): number {
  const angle =
    position === 'start' ? ARC_GEOMETRY.startAngle : ARC_GEOMETRY.startAngle - ARC_GEOMETRY.sweep;
  return -angle;
}
