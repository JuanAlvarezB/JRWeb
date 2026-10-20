import { describe, expect, it } from 'vitest';
import { parseAppConfig } from '@/shared/config/envSchema';

const base = { VITE_SITE_URL: 'https://conducirjrdelsinu.pages.dev' };

describe('parseAppConfig', () => {
  it('activa la analítica solo en producción con token', () => {
    const config = parseAppConfig({
      ...base,
      VITE_ENV_NAME: 'production',
      VITE_CF_ANALYTICS_TOKEN: 'token-publico',
    });
    expect(config.isProduction).toBe(true);
    expect(config.analyticsEnabled).toBe(true);
    expect(config.analyticsToken).toBe('token-publico');
  });

  it('ignora el token de analítica en QA', () => {
    const config = parseAppConfig({
      ...base,
      VITE_ENV_NAME: 'qa',
      VITE_CF_ANALYTICS_TOKEN: 'token-publico',
    });
    expect(config.isQa).toBe(true);
    expect(config.analyticsEnabled).toBe(false);
    expect(config.analyticsToken).toBeUndefined();
  });

  it('trata un token vacío como ausente', () => {
    const config = parseAppConfig({
      ...base,
      VITE_ENV_NAME: 'production',
      VITE_CF_ANALYTICS_TOKEN: '  ',
    });
    expect(config.analyticsEnabled).toBe(false);
  });

  it('rechaza un ambiente desconocido', () => {
    expect(() => parseAppConfig({ ...base, VITE_ENV_NAME: 'staging' })).toThrow(
      /Variables de entorno/,
    );
  });

  it('rechaza una URL con barra final', () => {
    expect(() =>
      parseAppConfig({
        VITE_ENV_NAME: 'qa',
        VITE_SITE_URL: 'https://qa.conducirjrdelsinu.pages.dev/',
      }),
    ).toThrow(/no debe terminar en "\/"/);
  });
});
