import { describe, expect, it } from 'vitest';
import {
  analyticsTag,
  assetTags,
  buildSitemap,
  injectPage,
  pageAssets,
  type Manifest,
} from '../../../scripts/prerender';
import type { PrerenderTarget } from '@/shared/prerender';

const TEMPLATE = [
  '<html><head>',
  '<title>Base</title>',
  '<script type="module" src="/static/index.js"></script>',
  '</head><body>',
  '<div id="root"></div>',
  '</body></html>',
].join('\n');

const PAGE = { html: '<h1>Planes</h1>', head: '<title>Planes</title>', state: '{"queries":[]}' };

describe('injectPage', () => {
  it('reemplaza el título, llena #root y agrega la caché de consultas', () => {
    const html = injectPage(TEMPLATE, PAGE);
    expect(html).toContain('<title>Planes</title>');
    expect(html).not.toContain('<title>Base</title>');
    expect(html).toContain('<div id="root"><h1>Planes</h1></div>');
    expect(html).toContain(
      '<script id="jr-query-state" type="application/json">{"queries":[]}</script>',
    );
    expect(html).not.toContain('beacon.min.js');
  });

  it('con token agrega el beacon de analítica antes de </body>', () => {
    const html = injectPage(TEMPLATE, PAGE, 'abc123');
    expect(html).toMatch(
      /beacon\.min\.js" data-cf-beacon='\{"token":"abc123"\}'><\/script>\n {2}<\/body>/u,
    );
  });

  it('enlaza los recursos de la página sin repetir los de la plantilla', () => {
    const html = injectPage(TEMPLATE, PAGE, undefined, {
      css: ['static/style.css'],
      js: ['static/index.js', 'static/PlansPage.js'],
    });
    expect(html).toContain('<link rel="stylesheet" crossorigin href="/static/style.css">');
    expect(html).toContain('<link rel="modulepreload" crossorigin href="/static/PlansPage.js">');
    expect(html).not.toContain('modulepreload" crossorigin href="/static/index.js"');
  });

  it('los $ del contenido no se interpretan como patrones de reemplazo', () => {
    const html = injectPage(TEMPLATE, { ...PAGE, html: '<p>$& $1</p>' });
    expect(html).toContain('<p>$& $1</p>');
  });

  it('falla si la plantilla no tiene los marcadores', () => {
    expect(() => injectPage('<html></html>', PAGE)).toThrow(/<title>/u);
  });
});

describe('pageAssets', () => {
  const manifest: Manifest = {
    'index.html': { file: 'static/index.js', isEntry: true, css: ['static/style.css'] },
    'src/pages/Plans.tsx': { file: 'static/Plans.js', imports: ['_a.js', 'index.html'] },
    '_a.js': { file: 'static/a.js', imports: ['_b.js'], css: ['static/a.css'] },
    '_b.js': { file: 'static/b.js', imports: ['_a.js'] },
  };

  it('recorre las importaciones (sin la entrada) y no se repite en ciclos', () => {
    expect(pageAssets(manifest, 'src/pages/Plans.tsx')).toEqual({
      css: ['static/a.css'],
      js: ['static/Plans.js', 'static/a.js', 'static/b.js'],
    });
  });

  it('falla si la página no está en el manifiesto', () => {
    expect(() => pageAssets(manifest, 'src/pages/Otra.tsx')).toThrow(/manifiesto/u);
  });

  it('assetTags genera los enlaces', () => {
    expect(assetTags({ css: ['static/a.css'], js: ['static/a.js'] })).toBe(
      '<link rel="stylesheet" crossorigin href="/static/a.css">\n    <link rel="modulepreload" crossorigin href="/static/a.js">',
    );
  });
});

describe('buildSitemap y analyticsTag', () => {
  const targets: PrerenderTarget[] = [
    { path: '/', file: 'index.html', inSitemap: true, module: 'a' },
    { path: '/planes', file: 'planes.html', inSitemap: true, module: 'b' },
    { path: '/404', file: '404.html', inSitemap: false, module: 'c' },
  ];

  it('solo las páginas públicas, con la URL canónica', () => {
    const xml = buildSitemap(targets);
    expect(xml).toContain('<loc>https://conducirjrdelsinu.pages.dev/</loc>');
    expect(xml).toContain('<loc>https://conducirjrdelsinu.pages.dev/planes</loc>');
    expect(xml).not.toContain('404');
  });

  it('el token del beacon no puede cerrar el atributo', () => {
    expect(analyticsTag("x'y")).toContain('data-cf-beacon=\'{"token":"x&#39;y"}\'');
  });
});
