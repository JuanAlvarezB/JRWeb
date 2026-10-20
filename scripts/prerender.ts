/**
 * Prerender (después de `vite build` y de la build del servidor):
 *
 * - Genera el HTML estático de cada página en `dist/` (`index.html`, `planes.html`,
 *   …, `404.html`) con su `<head>` (SEO, Open Graph, JSON-LD) y la caché de consultas
 *   para hidratar sin repetirlas.
 * - En PDN con token: agrega el beacon de Cloudflare Web Analytics y `sitemap.xml`.
 *
 * Uso: `tsx scripts/prerender.ts --mode qa|production [--outDir dist] [--serverDir dist-server]`
 */
import { readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';
import { loadEnv } from 'vite';
import { parseAppConfig } from '../src/shared/config/envSchema.ts';
import { CANONICAL_ORIGIN } from '../src/shared/constants/site.ts';
import {
  QUERY_STATE_ELEMENT_ID,
  type PrerenderedPage,
  type PrerenderTarget,
  type ServerEntry,
} from '../src/shared/prerender.ts';

/** Script del beacon de Cloudflare Web Analytics (sin cookies). */
export const ANALYTICS_SCRIPT_URL = 'https://static.cloudflareinsights.com/beacon.min.js';

const ROOT_MARKER = '<div id="root"></div>';
const TITLE_PATTERN = /<title>[\s\S]*?<\/title>/u;

/** Entrada del manifiesto de Vite (`dist/.vite/manifest.json`). */
export interface ManifestChunk {
  readonly file: string;
  readonly css?: readonly string[];
  readonly imports?: readonly string[];
  readonly isEntry?: boolean;
}

export type Manifest = Readonly<Record<string, ManifestChunk>>;

/** CSS y JS de una página con los fragmentos que importa (sin la entrada principal). */
export interface PageAssets {
  readonly css: readonly string[];
  readonly js: readonly string[];
}

/**
 * Recursos de una página según el manifiesto. La entrada principal se omite: sus
 * archivos ya están en la plantilla.
 *
 * @throws {Error} Si el módulo de la página no está en el manifiesto.
 */
export function pageAssets(manifest: Manifest, module: string): PageAssets {
  if (manifest[module] === undefined)
    throw new Error(`${module} no está en el manifiesto de Vite.`);
  const css = new Set<string>();
  const js = new Set<string>();
  const visit = (key: string): void => {
    const chunk = manifest[key];
    if (chunk === undefined || chunk.isEntry === true || js.has(chunk.file)) return;
    js.add(chunk.file);
    for (const file of chunk.css ?? []) css.add(file);
    for (const imported of chunk.imports ?? []) visit(imported);
  };
  visit(module);
  return { css: [...css], js: [...js] };
}

/** Enlaces del `<head>` para los recursos de la página: estilos y precarga del JS. */
export function assetTags({ css, js }: PageAssets): string {
  return [
    ...css.map((file) => `<link rel="stylesheet" crossorigin href="/${file}">`),
    ...js.map((file) => `<link rel="modulepreload" crossorigin href="/${file}">`),
  ].join('\n    ');
}

/** Etiqueta del beacon con el token público de PDN. */
export function analyticsTag(token: string): string {
  const config = JSON.stringify({ token }).replace(/'/gu, '&#39;');
  return `<script defer src="${ANALYTICS_SCRIPT_URL}" data-cf-beacon='${config}'></script>`;
}

/**
 * Inserta una página prerenderizada en la plantilla de Vite (`dist/index.html`).
 *
 * @throws {Error} Si la plantilla no tiene `<title>` o `<div id="root"></div>`.
 */
export function injectPage(
  template: string,
  page: PrerenderedPage,
  analyticsToken?: string,
  assets: PageAssets = { css: [], js: [] },
): string {
  if (!TITLE_PATTERN.test(template) || !template.includes(ROOT_MARKER)) {
    throw new Error('La plantilla no tiene <title> o <div id="root"></div>.');
  }
  const state = `<script id="${QUERY_STATE_ELEMENT_ID}" type="application/json">${page.state}</script>`;
  // Lo que la plantilla ya enlaza (la entrada principal) no se repite.
  const pending = {
    css: assets.css.filter((file) => !template.includes(`/${file}`)),
    js: assets.js.filter((file) => !template.includes(`/${file}`)),
  };
  let html = template
    .replace(TITLE_PATTERN, () => page.head)
    .replace('</head>', () => `  ${assetTags(pending)}\n  </head>`)
    .replace(ROOT_MARKER, () => `<div id="root">${page.html}</div>\n    ${state}`);
  if (analyticsToken !== undefined) {
    html = html.replace('</body>', () => `  ${analyticsTag(analyticsToken)}\n  </body>`);
  }
  return html;
}

/** `sitemap.xml` con las URL canónicas de las páginas públicas. */
export function buildSitemap(targets: readonly PrerenderTarget[]): string {
  const urls = targets
    .filter((target) => target.inSitemap)
    .map((target) => {
      const loc =
        target.path === '/' ? `${CANONICAL_ORIGIN}/` : `${CANONICAL_ORIGIN}${target.path}`;
      return `  <url><loc>${loc}</loc></url>`;
    });
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    '</urlset>',
    '',
  ].join('\n');
}

async function main(): Promise<void> {
  const { values } = parseArgs({
    options: {
      mode: { type: 'string' },
      outDir: { type: 'string', default: 'dist' },
      serverDir: { type: 'string', default: 'dist-server' },
    },
  });
  const mode = values.mode;
  if (mode !== 'qa' && mode !== 'production') {
    throw new Error('Indica --mode qa o --mode production.');
  }

  const rootDir = process.cwd();
  const config = parseAppConfig(loadEnv(mode, rootDir, 'VITE_'));
  const outDir = path.resolve(rootDir, values.outDir);
  const serverEntry = path.resolve(rootDir, values.serverDir, 'entry-server.js');
  // La build del servidor cumple el contrato `ServerEntry` (src/shared/prerender.ts).
  const server = (await import(pathToFileURL(serverEntry).href)) as ServerEntry;
  const template = await readFile(path.join(outDir, 'index.html'), 'utf8');
  const manifestDir = path.join(outDir, '.vite');
  const manifest = JSON.parse(
    await readFile(path.join(manifestDir, 'manifest.json'), 'utf8'),
  ) as Manifest;

  for (const target of server.PRERENDER_TARGETS) {
    const page = await server.renderPage(target.path);
    await writeFile(
      path.join(outDir, target.file),
      injectPage(template, page, config.analyticsToken, pageAssets(manifest, target.module)),
      'utf8',
    );
    console.log(`✓ ${target.path} → ${values.outDir}/${target.file}`);
  }

  // El manifiesto solo sirve para la build: no se publica.
  await rm(manifestDir, { recursive: true, force: true });

  if (config.isProduction) {
    await writeFile(
      path.join(outDir, 'sitemap.xml'),
      buildSitemap(server.PRERENDER_TARGETS),
      'utf8',
    );
    console.log(
      `✓ sitemap.xml (${String(server.PRERENDER_TARGETS.filter((t) => t.inSitemap).length)} URL)`,
    );
  }
  console.log(
    `✓ Prerender de "${config.envName}"${config.analyticsEnabled ? ' con analítica' : ' sin analítica'}.`,
  );
}

const executedDirectly =
  process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href;

if (executedDirectly) {
  main().catch((error: unknown) => {
    console.error(error instanceof Error ? (error.stack ?? error.message) : error);
    process.exit(1);
  });
}
