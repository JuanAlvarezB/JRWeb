import { describe, expect, it } from 'vitest';
import {
  ARC_GEOMETRY,
  arcCircumference,
  computeSegmentDashes,
  needleRotation,
  polarToCartesian,
} from '@/presentation/components/brand/speedometerGeometry';

const lengthOf = (dashArray: string): number => Number(dashArray.split(' ')[0]);
const degreesToLength = (degrees: number): number => (degrees / 360) * arcCircumference();

describe('computeSegmentDashes', () => {
  it('reparte 240° menos los huecos de forma proporcional (B1: 25/5/20)', () => {
    const [theory, workshop, driving] = computeSegmentDashes([25, 5, 20]);
    const available = ARC_GEOMETRY.sweep - 2 * ARC_GEOMETRY.gap;
    expect(lengthOf(theory?.dashArray ?? '')).toBeCloseTo(
      degreesToLength((available * 25) / 50),
      1,
    );
    expect(lengthOf(workshop?.dashArray ?? '')).toBeCloseTo(
      degreesToLength((available * 5) / 50),
      1,
    );
    expect(lengthOf(driving?.dashArray ?? '')).toBeCloseTo(
      degreesToLength((available * 20) / 50),
      1,
    );
  });

  it('cada tramo empieza donde termina el anterior más el hueco', () => {
    const [theory, workshop] = computeSegmentDashes([25, 5, 20]);
    expect(theory?.dashOffset).toBeCloseTo(0, 5);
    const expectedStart = lengthOf(theory?.dashArray ?? '') + degreesToLength(ARC_GEOMETRY.gap);
    expect(-(workshop?.dashOffset ?? 0)).toBeCloseTo(expectedStart, 1);
  });

  it('un solo tramo ocupa el arco completo sin huecos', () => {
    const [full] = computeSegmentDashes([1]);
    expect(lengthOf(full?.dashArray ?? '')).toBeCloseTo(degreesToLength(ARC_GEOMETRY.sweep), 1);
  });

  it('los valores en cero quedan invisibles y no consumen hueco', () => {
    const dashes = computeSegmentDashes([10, 0, 10]);
    expect(lengthOf(dashes[1]?.dashArray ?? '')).toBe(0);
    const available = ARC_GEOMETRY.sweep - ARC_GEOMETRY.gap;
    expect(lengthOf(dashes[0]?.dashArray ?? '')).toBeCloseTo(degreesToLength(available / 2), 1);
  });
});

describe('aguja y coordenadas', () => {
  it('apunta a cero (210°) y al final del arco (−30°)', () => {
    expect(needleRotation('start')).toBe(-210);
    expect(needleRotation('end')).toBe(30);
  });

  it('convierte ángulos matemáticos a coordenadas SVG (y hacia abajo)', () => {
    expect(polarToCartesian(100, 90)).toEqual({ x: 160, y: 60 });
    expect(polarToCartesian(100, 0)).toEqual({ x: 260, y: 160 });
  });
});
