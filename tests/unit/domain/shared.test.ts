import { describe, expect, it } from 'vitest';
import { DomainError } from '@/domain/errors/DomainError';
import { InvalidContentError } from '@/domain/errors/InvalidContentError';
import { NotFoundError } from '@/domain/errors/NotFoundError';
import { slugify } from '@/domain/shared/slug';
import { deepFreeze, findDuplicates, Issues, isIsoDate } from '@/domain/shared/validation';

describe('validación compartida', () => {
  it('slugify quita tildes, signos y espacios', () => {
    expect(slugify('2. IDENTIFICACIÓN DEL RESPONSABLE')).toBe('2-identificacion-del-responsable');
    expect(slugify('1.MARCO NORMATIVO')).toBe('1-marco-normativo');
  });

  it('isIsoDate exige fechas reales del calendario', () => {
    expect(isIsoDate('2024-02-29')).toBe(true);
    expect(isIsoDate('2026-02-29')).toBe(false);
    expect(isIsoDate('2026-10-1')).toBe(false);
  });

  it('findDuplicates devuelve cada repetido una vez', () => {
    expect(findDuplicates(['a', 'b', 'a', 'a'])).toEqual(['a']);
  });

  it('deepFreeze congela objetos anidados', () => {
    const value = deepFreeze({ a: { b: [1] } });
    expect(Object.isFrozen(value.a.b)).toBe(true);
  });

  it('Issues.include deja pasar errores que no son del dominio', () => {
    const issues = new Issues('Prueba');
    expect(() => {
      issues.include('x', () => {
        throw new TypeError('falla técnica');
      });
    }).toThrow(TypeError);
  });

  it('los errores del dominio conservan su tipo y sus datos', () => {
    const invalid = new InvalidContentError('Plan', ['a', 'b']);
    expect(invalid).toBeInstanceOf(DomainError);
    expect(invalid.name).toBe('InvalidContentError');
    expect(invalid.message).toContain('- b');
    expect(new NotFoundError('Plan', 'B2').message).toBe('Plan no encontrado: B2');
  });
});
