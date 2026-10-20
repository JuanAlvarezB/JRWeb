import { describe, expect, it } from 'vitest';
import { cx } from '@/shared/utils/cx';

describe('cx', () => {
  it('une las clases válidas con un espacio', () => {
    expect(cx('button', 'primary')).toBe('button primary');
  });

  it('ignora false, null, undefined y cadenas vacías', () => {
    expect(cx('button', false, null, undefined, '', 'large')).toBe('button large');
  });
});
