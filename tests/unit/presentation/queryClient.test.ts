import { describe, expect, it } from 'vitest';
import { InvalidContentError } from '@/domain/errors/InvalidContentError';
import { NotFoundError } from '@/domain/errors/NotFoundError';
import {
  createQueryClient,
  MAX_QUERY_RETRIES,
  shouldRetryQuery,
} from '@/presentation/providers/queryClient';

describe('shouldRetryQuery', () => {
  it('no reintenta errores del dominio: el resultado sería el mismo', () => {
    expect(shouldRetryQuery(0, new InvalidContentError('Plan', ['sin horas']))).toBe(false);
    expect(shouldRetryQuery(0, new NotFoundError('Plan', 'C2'))).toBe(false);
  });

  it(`reintenta fallas técnicas hasta ${MAX_QUERY_RETRIES} veces`, () => {
    const network = new TypeError('Failed to fetch dynamically imported module');
    expect(shouldRetryQuery(0, network)).toBe(true);
    expect(shouldRetryQuery(MAX_QUERY_RETRIES - 1, network)).toBe(true);
    expect(shouldRetryQuery(MAX_QUERY_RETRIES, network)).toBe(false);
  });
});

describe('createQueryClient', () => {
  it('el contenido estático no se vuelve a pedir y usa la regla de reintentos', () => {
    const defaults = createQueryClient().getDefaultOptions().queries;
    expect(defaults?.staleTime).toBe(Number.POSITIVE_INFINITY);
    expect(defaults?.retry).toBe(shouldRetryQuery);
  });

  it('crea un cliente nuevo en cada llamada (sin caché compartida)', () => {
    expect(createQueryClient()).not.toBe(createQueryClient());
  });
});
