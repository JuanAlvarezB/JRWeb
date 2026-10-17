import { expect, test } from '../../fixtures/test';

/**
 * SEO del HTML prerenderizado, leído sin ejecutar JavaScript (como un buscador).
 * Fuera de PDN todas las páginas llevan `noindex`. Se espera PDN cuando se prueba el
 * sitio publicado o una build de producción (`BUILD_MODE`, en los PR hacia main).
 */
const CANONICAL_ORIGIN = 'https://conducirjrdelsinu.pages.dev';
const isProduction =
  process.env.BASE_URL === CANONICAL_ORIGIN || process.env.BUILD_MODE === 'production';

const PAGES = [
  { path: '/', h1: 'Aprende a conducir con confianza en Cereté', jsonLd: 'DrivingSchool' },
  { path: '/nosotros', h1: 'Nosotros', jsonLd: undefined },
  { path: '/servicios', h1: 'Servicios', jsonLd: undefined },
  { path: '/planes', h1: 'Planes', jsonLd: undefined },
  { path: '/contactanos', h1: 'Contáctanos', jsonLd: 'DrivingSchool' },
  { path: '/preguntas-frecuentes', h1: 'Preguntas frecuentes', jsonLd: 'FAQPage' },
  {
    path: '/politica-de-tratamiento-de-datos',
    h1: 'Política de tratamiento de datos',
    jsonLd: undefined,
  },
] as const;

const attribute = (html: string, pattern: RegExp): string | undefined => pattern.exec(html)?.[1];

for (const page of PAGES) {
  test(`${page.path}: HTML completo con título, descripción, canónica y datos estructurados`, async ({
    request,
  }) => {
    const response = await request.get(page.path);
    expect(response.status()).toBe(200);
    const html = await response.text();

    expect(html).toContain(`>${page.h1}</h1>`);
    expect(html.match(/<title>/gu)).toHaveLength(1);
    expect(attribute(html, /<title>([^<]+)<\/title>/u)).toMatch(/Conducir J&amp;R del Sinú/u);
    expect(attribute(html, /<meta name="description" content="([^"]+)"/u)?.length).toBeGreaterThan(
      50,
    );
    expect(attribute(html, /<link rel="canonical" href="([^"]+)"/u)).toBe(
      page.path === '/' ? `${CANONICAL_ORIGIN}/` : `${CANONICAL_ORIGIN}${page.path}`,
    );
    expect(attribute(html, /<meta name="robots" content="([^"]+)"/u)).toBe(
      isProduction ? 'index, follow' : 'noindex, nofollow',
    );
    expect(html).toContain(
      '<meta property="og:image" content="https://conducirjrdelsinu.pages.dev/og-image.png"',
    );

    const types = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gu)].map(
      (match) => (JSON.parse(match[1] ?? '{}') as { '@type'?: string })['@type'],
    );
    expect(types).toEqual(page.jsonLd === undefined ? [] : [page.jsonLd]);
    // La CSP no permite scripts en línea: el contenido de #root no trae ninguno.
    const root = html.slice(
      html.indexOf('<div id="root">'),
      html.indexOf('<script id="jr-query-state"'),
    );
    expect(root).not.toContain('<script');
  });
}

test('una ruta inexistente responde 404 con la página "Te saliste de la vía" y noindex', async ({
  request,
}) => {
  const response = await request.get('/esta-ruta-no-existe');
  expect(response.status()).toBe(404);
  const html = await response.text();
  expect(html).toContain('>Te saliste de la vía</h1>');
  expect(html).toContain('<meta name="robots" content="noindex, nofollow" />');
  expect(html).not.toContain('rel="canonical"');
});

test('las URL con .html o barra final redirigen a la URL limpia', async ({ request }) => {
  for (const path of ['/planes.html', '/planes/']) {
    const response = await request.get(path, { maxRedirects: 0 });
    expect(response.status()).toBe(308);
    expect(response.headers().location).toBe('/planes');
  }
});
