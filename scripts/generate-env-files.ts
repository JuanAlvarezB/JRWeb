/**
 * Genera los archivos que dependen del ambiente después de `vite build`:
 *
 * - `dist/robots.txt`: QA bloquea todo; PDN permite todo y publica el sitemap.
 * - `dist/_headers`: base de `public/_headers` + Content-Security-Policy del
 *   ambiente + `X-Robots-Tag: noindex` en QA.
 *
 * Uso: `tsx scripts/generate-env-files.ts --mode qa|production [--outDir dist]`
 */
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';
import { loadEnv } from 'vite';
import { parseAppConfig, type AppConfig } from '../src/shared/config/envSchema.ts';
import { CANONICAL_ORIGIN } from '../src/shared/constants/site.ts';

/** Orígenes externos permitidos. Cada uno existe por una razón concreta. */
const EXTERNAL_ORIGINS = {
  /** Mapa embebido: solo se carga cuando el visitante pulsa "Ver mapa". */
  googleMaps: ['https://www.google.com', 'https://maps.google.com'],
  /** Script del beacon de Cloudflare Web Analytics (solo PDN). */
  analyticsScript: 'https://static.cloudflareinsights.com',
  /** Envío de métricas del beacon (solo PDN). */
  analyticsBeacon: 'https://cloudflareinsights.com',
} as const;

/** Construye el robots.txt del ambiente. */
export function buildRobots(config: AppConfig): string {
  if (!config.isProduction) {
    return ['# Ambiente no público: no indexar.', 'User-agent: *', 'Disallow: /', ''].join('\n');
  }
  return ['User-agent: *', 'Allow: /', '', `Sitemap: ${CANONICAL_ORIGIN}/sitemap.xml`, ''].join(
    '\n',
  );
}

/** Construye la Content-Security-Policy del ambiente. */
export function buildContentSecurityPolicy(config: AppConfig): string {
  const analytics = config.analyticsEnabled;
  const directives: Record<string, string[]> = {
    'default-src': ["'self'"],
    'script-src': ["'self'", ...(analytics ? [EXTERNAL_ORIGINS.analyticsScript] : [])],
    'style-src': ["'self'"],
    // Atributos style generados por React (p. ej. proporciones del arco del velocímetro).
    'style-src-attr': ["'unsafe-inline'"],
    'img-src': ["'self'", 'data:'],
    'font-src': ["'self'"],
    'connect-src': ["'self'", ...(analytics ? [EXTERNAL_ORIGINS.analyticsBeacon] : [])],
    'frame-src': [...EXTERNAL_ORIGINS.googleMaps],
    'manifest-src': ["'self'"],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'none'"],
    'frame-ancestors': ["'none'"],
    'upgrade-insecure-requests': [],
  };
  return Object.entries(directives)
    .map(([name, values]) => [name, ...values].join(' '))
    .join('; ');
}

/** Combina la base de `public/_headers` con los encabezados del ambiente. */
export function buildHeaders(baseHeaders: string, config: AppConfig): string {
  const environmentRules = [
    '/*',
    `  Content-Security-Policy: ${buildContentSecurityPolicy(config)}`,
    ...(config.isProduction ? [] : ['  X-Robots-Tag: noindex, nofollow']),
  ];
  return [
    `# Generado por scripts/generate-env-files.ts (ambiente: ${config.envName}). No editar en dist/.`,
    baseHeaders.trimEnd(),
    '',
    '# --- Encabezados del ambiente ---',
    ...environmentRules,
    '',
  ].join('\n');
}

async function main(): Promise<void> {
  const { values } = parseArgs({
    options: {
      mode: { type: 'string' },
      outDir: { type: 'string', default: 'dist' },
    },
  });
  const mode = values.mode;
  if (mode !== 'qa' && mode !== 'production') {
    throw new Error('Indica --mode qa o --mode production.');
  }

  const rootDir = process.cwd();
  const config = parseAppConfig(loadEnv(mode, rootDir, 'VITE_'));
  const outDir = path.resolve(rootDir, values.outDir);
  const baseHeaders = await readFile(path.join(rootDir, 'public', '_headers'), 'utf8');

  await writeFile(path.join(outDir, 'robots.txt'), buildRobots(config), 'utf8');
  await writeFile(path.join(outDir, '_headers'), buildHeaders(baseHeaders, config), 'utf8');

  if (config.isProduction && !config.analyticsEnabled) {
    console.warn('⚠️  PDN sin VITE_CF_ANALYTICS_TOKEN: la analítica quedará desactivada.');
  }
  console.log(`✓ robots.txt y _headers generados para "${config.envName}" en ${values.outDir}/`);
}

const executedDirectly =
  process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href;

if (executedDirectly) {
  main().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
}
