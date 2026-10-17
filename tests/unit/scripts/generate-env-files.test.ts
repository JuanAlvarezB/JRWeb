import { describe, expect, it } from 'vitest';
import {
  buildContentSecurityPolicy,
  buildHeaders,
  buildRobots,
} from '../../../scripts/generate-env-files';
import { parseAppConfig } from '@/shared/config/envSchema';

const qa = parseAppConfig({
  VITE_ENV_NAME: 'qa',
  VITE_SITE_URL: 'https://qa.conducirjrdelsinu.pages.dev',
});
const production = parseAppConfig({
  VITE_ENV_NAME: 'production',
  VITE_SITE_URL: 'https://conducirjrdelsinu.pages.dev',
  VITE_CF_ANALYTICS_TOKEN: 'token-publico',
});
const productionWithoutAnalytics = parseAppConfig({
  VITE_ENV_NAME: 'production',
  VITE_SITE_URL: 'https://conducirjrdelsinu.pages.dev',
});

describe('buildRobots', () => {
  it('bloquea todo en QA', () => {
    expect(buildRobots(qa)).toContain('Disallow: /');
    expect(buildRobots(qa)).not.toContain('Sitemap');
  });

  it('permite indexar PDN y publica el sitemap canónico', () => {
    const robots = buildRobots(production);
    expect(robots).toContain('Allow: /');
    expect(robots).toContain('Sitemap: https://conducirjrdelsinu.pages.dev/sitemap.xml');
  });
});

describe('buildContentSecurityPolicy', () => {
  it('permite el beacon de Cloudflare solo con analítica activa', () => {
    expect(buildContentSecurityPolicy(production)).toContain(
      'https://static.cloudflareinsights.com',
    );
    expect(buildContentSecurityPolicy(qa)).not.toContain('cloudflareinsights');
    expect(buildContentSecurityPolicy(productionWithoutAnalytics)).not.toContain(
      'cloudflareinsights',
    );
  });

  it('permite el mapa embebido de Google y prohíbe ser embebido', () => {
    const csp = buildContentSecurityPolicy(qa);
    expect(csp).toContain('frame-src https://www.google.com https://maps.google.com');
    expect(csp).toContain("frame-ancestors 'none'");
  });
});

describe('buildHeaders', () => {
  it('agrega noindex solo en QA', () => {
    expect(buildHeaders('/*\n  X-Frame-Options: DENY', qa)).toContain('X-Robots-Tag: noindex');
    expect(buildHeaders('/*\n  X-Frame-Options: DENY', production)).not.toContain('X-Robots-Tag');
  });

  it('conserva los encabezados base', () => {
    expect(buildHeaders('/*\n  X-Frame-Options: DENY', production)).toContain(
      'X-Frame-Options: DENY',
    );
  });
});
