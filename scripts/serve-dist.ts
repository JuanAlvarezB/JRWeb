/**
 * Servidor local de `dist/` con las reglas de Cloudflare Pages, para la vista previa
 * y las pruebas e2e (así prueban lo mismo que se publica):
 *
 * - `/planes` sirve `planes.html`; `/planes.html` y `/planes/` redirigen a `/planes`.
 * - Una ruta inexistente responde `404.html` con estado 404.
 * - Aplica `_redirects` y los encabezados de `_headers` (incluida la CSP).
 * - Comprime el texto con Brotli o gzip, como Cloudflare (las mediciones de
 *   rendimiento locales se parecen a las de producción).
 *
 * Uso: `tsx scripts/serve-dist.ts [--port 4173] [--dir dist]`
 */
import { existsSync, statSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';
import { brotliCompressSync, gzipSync } from 'node:zlib';

/** Qué responder a una ruta. */
export type Resolution =
  | { readonly kind: 'file'; readonly file: string; readonly status: 200 | 404 }
  | { readonly kind: 'redirect'; readonly location: string; readonly status: 301 | 302 | 308 };

/** Regla de `_headers`: patrón de ruta y encabezados. */
export interface HeaderRule {
  readonly pattern: string;
  readonly headers: readonly (readonly [string, string])[];
}

/** Regla de `_redirects`: origen, destino y código. */
export interface RedirectRule {
  readonly from: string;
  readonly to: string;
  readonly status: 301 | 302;
}

/** Tipos que Cloudflare comprime (texto); las imágenes y fuentes ya van comprimidas. */
const COMPRESSIBLE = /^(text\/|application\/(json|xml)|image\/svg)/u;

/** Codificación que se usa según `Accept-Encoding`: Brotli, gzip o ninguna. */
export function pickEncoding(
  acceptEncoding: string | undefined,
  contentType: string,
): 'br' | 'gzip' | undefined {
  if (acceptEncoding === undefined || !COMPRESSIBLE.test(contentType)) return undefined;
  if (/\bbr\b/u.test(acceptEncoding)) return 'br';
  if (/\bgzip\b/u.test(acceptEncoding)) return 'gzip';
  return undefined;
}

const CONTENT_TYPES: Readonly<Record<string, string>> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
};

/** Lee `_headers`: una línea sin sangría es un patrón; las indentadas, sus encabezados. */
export function parseHeaders(text: string): HeaderRule[] {
  const rules: { pattern: string; headers: [string, string][] }[] = [];
  for (const line of text.split('\n')) {
    if (line.trim() === '' || line.trimStart().startsWith('#')) continue;
    if (!/^\s/u.test(line)) {
      rules.push({ pattern: line.trim(), headers: [] });
      continue;
    }
    const separator = line.indexOf(':');
    const current = rules.at(-1);
    if (separator === -1 || current === undefined) continue;
    current.headers.push([line.slice(0, separator).trim(), line.slice(separator + 1).trim()]);
  }
  return rules;
}

/** Lee `_redirects`: `origen destino [código]`. */
export function parseRedirects(text: string): RedirectRule[] {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line !== '' && !line.startsWith('#'))
    .map((line) => line.split(/\s+/u))
    .filter((parts) => parts.length >= 2)
    .map(([from = '', to = '', code]) => ({ from, to, status: code === '302' ? 302 : 301 }));
}

/** `/*` y `/static/*` como en Pages: `*` coincide con cualquier resto de la ruta. */
export function matchesPattern(pattern: string, pathname: string): boolean {
  return pattern.endsWith('*') ? pathname.startsWith(pattern.slice(0, -1)) : pattern === pathname;
}

/**
 * Encabezados que aplican a una ruta (en el orden del archivo). Localmente se sirve
 * por http, así que se quita `upgrade-insecure-requests` de la CSP (WebKit pasaría
 * todo a https y fallaría); en Cloudflare todo es https y la directiva se mantiene.
 */
export function headersFor(pathname: string, rules: readonly HeaderRule[]): [string, string][] {
  return rules
    .filter((rule) => matchesPattern(rule.pattern, pathname))
    .flatMap((rule) => [...rule.headers])
    .map(([name, value]): [string, string] =>
      name.toLowerCase() === 'content-security-policy'
        ? [name, value.replace(/;\s*upgrade-insecure-requests/u, '')]
        : [name, value],
    );
}

/**
 * Resuelve una ruta como Cloudflare Pages.
 *
 * @param isFile - Indica si existe un archivo en `dist/` con esa ruta relativa.
 */
export function resolveRequest(
  pathname: string,
  isFile: (relativePath: string) => boolean,
  redirects: readonly RedirectRule[] = [],
): Resolution {
  const redirect = redirects.find((rule) => rule.from === pathname);
  if (redirect !== undefined)
    return { kind: 'redirect', location: redirect.to, status: redirect.status };
  if (pathname === '/') return { kind: 'file', file: 'index.html', status: 200 };
  if (pathname.endsWith('/')) {
    return { kind: 'redirect', location: pathname.replace(/\/+$/u, ''), status: 308 };
  }
  if (pathname.endsWith('.html')) {
    const clean = pathname === '/index.html' ? '/' : pathname.slice(0, -'.html'.length);
    return { kind: 'redirect', location: clean, status: 308 };
  }
  const relative = pathname.slice(1);
  if (isFile(relative)) return { kind: 'file', file: relative, status: 200 };
  if (isFile(`${relative}.html`)) return { kind: 'file', file: `${relative}.html`, status: 200 };
  return { kind: 'file', file: '404.html', status: 404 };
}

async function main(): Promise<void> {
  const { values } = parseArgs({
    options: {
      port: { type: 'string', default: '4173' },
      dir: { type: 'string', default: 'dist' },
    },
  });
  const root = path.resolve(process.cwd(), values.dir);
  const readOptional = async (file: string): Promise<string> =>
    existsSync(path.join(root, file)) ? readFile(path.join(root, file), 'utf8') : '';
  const headerRules = parseHeaders(await readOptional('_headers'));
  const redirectRules = parseRedirects(await readOptional('_redirects'));

  const isFile = (relative: string): boolean => {
    const absolute = path.resolve(root, relative);
    // Nunca fuera de dist/.
    if (!absolute.startsWith(`${root}${path.sep}`)) return false;
    return existsSync(absolute) && statSync(absolute).isFile();
  };

  const server = createServer((request, response) => {
    const pathname = decodeURIComponent(new URL(request.url ?? '/', 'http://localhost').pathname);
    const resolution = resolveRequest(pathname, isFile, redirectRules);
    const headers = new Map(headersFor(pathname, headerRules));
    if (resolution.kind === 'redirect') {
      response.writeHead(resolution.status, {
        ...Object.fromEntries(headers),
        Location: resolution.location,
      });
      response.end();
      return;
    }
    readFile(path.join(root, resolution.file))
      .then((body) => {
        const contentType =
          CONTENT_TYPES[path.extname(resolution.file)] ?? 'application/octet-stream';
        headers.set('Content-Type', contentType);
        const encoding = pickEncoding(request.headers['accept-encoding'], contentType);
        if (encoding !== undefined) {
          headers.set('Content-Encoding', encoding);
          headers.set('Vary', 'Accept-Encoding');
        }
        response.writeHead(resolution.status, Object.fromEntries(headers));
        response.end(
          encoding === 'br'
            ? brotliCompressSync(body)
            : encoding === 'gzip'
              ? gzipSync(body)
              : body,
        );
      })
      .catch(() => {
        response.writeHead(500);
        response.end();
      });
  });

  server.listen(Number(values.port), () => {
    console.log(
      `Sirviendo ${values.dir}/ como Cloudflare Pages en http://localhost:${values.port}`,
    );
  });
}

const executedDirectly =
  process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href;

if (executedDirectly) {
  main().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
}
