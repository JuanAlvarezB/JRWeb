import { describe, expect, it } from 'vitest';
import {
  headersFor,
  matchesPattern,
  parseHeaders,
  parseRedirects,
  pickEncoding,
  resolveRequest,
} from '../../../scripts/serve-dist';

const FILES = new Set(['index.html', 'planes.html', '404.html', 'static/app.js', 'robots.txt']);
const isFile = (relative: string): boolean => FILES.has(relative);

describe('resolveRequest (reglas de Cloudflare Pages)', () => {
  it('sirve las páginas sin extensión y los archivos tal cual', () => {
    expect(resolveRequest('/', isFile)).toEqual({ kind: 'file', file: 'index.html', status: 200 });
    expect(resolveRequest('/planes', isFile)).toEqual({
      kind: 'file',
      file: 'planes.html',
      status: 200,
    });
    expect(resolveRequest('/static/app.js', isFile)).toMatchObject({ file: 'static/app.js' });
  });

  it('redirige .html y la barra final a la URL limpia', () => {
    expect(resolveRequest('/planes.html', isFile)).toEqual({
      kind: 'redirect',
      location: '/planes',
      status: 308,
    });
    expect(resolveRequest('/planes/', isFile)).toEqual({
      kind: 'redirect',
      location: '/planes',
      status: 308,
    });
    expect(resolveRequest('/index.html', isFile)).toEqual({
      kind: 'redirect',
      location: '/',
      status: 308,
    });
  });

  it('una ruta inexistente responde 404.html con estado 404', () => {
    expect(resolveRequest('/no-existe', isFile)).toEqual({
      kind: 'file',
      file: '404.html',
      status: 404,
    });
  });

  it('aplica _redirects antes que todo', () => {
    const rules = parseRedirects('# comentario\n/contacto /contactanos 301\n/tmp /planes 302\n');
    expect(resolveRequest('/contacto', isFile, rules)).toEqual({
      kind: 'redirect',
      location: '/contactanos',
      status: 301,
    });
    expect(rules[1]?.status).toBe(302);
  });
});

describe('_headers', () => {
  const rules = parseHeaders(
    [
      '# base',
      '/*',
      '  X-Frame-Options: DENY',
      "  Content-Security-Policy: default-src 'self'; upgrade-insecure-requests",
      '/static/*',
      '  Cache-Control: public, max-age=31536000, immutable',
    ].join('\n'),
  );

  it('patrones con * y encabezados en orden', () => {
    expect(matchesPattern('/static/*', '/static/a.js')).toBe(true);
    expect(matchesPattern('/static/*', '/planes')).toBe(false);
    expect(headersFor('/static/a.js', rules).map(([name]) => name)).toEqual([
      'X-Frame-Options',
      'Content-Security-Policy',
      'Cache-Control',
    ]);
  });

  it('localmente quita upgrade-insecure-requests (se sirve por http)', () => {
    const csp = new Map(headersFor('/', rules)).get('Content-Security-Policy');
    expect(csp).toBe("default-src 'self'");
  });
});

describe('pickEncoding', () => {
  it('Brotli antes que gzip, solo para texto', () => {
    expect(pickEncoding('gzip, deflate, br', 'text/html; charset=utf-8')).toBe('br');
    expect(pickEncoding('gzip', 'text/css')).toBe('gzip');
    expect(pickEncoding('br', 'image/png')).toBeUndefined();
    expect(pickEncoding(undefined, 'text/html')).toBeUndefined();
  });
});
