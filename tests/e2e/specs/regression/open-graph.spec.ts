import { expect, test } from '../../fixtures/test';

/**
 * Vistas previas al compartir (WhatsApp, Facebook, LinkedIn y X): Open Graph y tarjeta
 * de X en el HTML prerenderizado, leído sin ejecutar JavaScript, como los robots de las
 * redes. Las URL apuntan siempre a PDN; la imagen se descarga del sitio bajo prueba
 * (la misma ruta), porque PDN puede no tener aún esta versión.
 */
const CANONICAL_ORIGIN = 'https://conducirjrdelsinu.pages.dev';
const SITE_NAME = 'Conducir J&R del Sinú';
/** WhatsApp corta las descripciones más largas. */
const SHARE_DESCRIPTION_MAX_LENGTH = 80;
/** WhatsApp solo lee el `<head>` si está dentro de los primeros 300 KB del HTML. */
const HEAD_MAX_BYTES = 300 * 1024;
const OG_IMAGE_MAX_BYTES = 250 * 1024;

const PAGES = [
  { path: '/', status: 200 },
  { path: '/nosotros', status: 200 },
  { path: '/servicios', status: 200 },
  { path: '/planes', status: 200 },
  { path: '/contactanos', status: 200 },
  { path: '/preguntas-frecuentes', status: 200 },
  { path: '/politica-de-tratamiento-de-datos', status: 200 },
  { path: '/no-existe', status: 404 },
] as const;

const REQUIRED_TAGS = [
  'og:type',
  'og:locale',
  'og:site_name',
  'og:title',
  'og:description',
  'og:image',
  'og:image:type',
  'og:image:width',
  'og:image:height',
  'og:image:alt',
  'twitter:card',
  'twitter:title',
  'twitter:description',
  'twitter:image',
  'twitter:image:alt',
] as const;

const decodeEntities = (text: string): string =>
  text
    .replace(/&quot;/gu, '"')
    .replace(/&lt;/gu, '<')
    .replace(/&gt;/gu, '>')
    .replace(/&amp;/gu, '&');

/** Etiquetas `<meta property|name>` del `<head>`, con el contenido decodificado. */
function metaTags(head: string): ReadonlyMap<string, string> {
  const pattern = /<meta (?:property|name)="([^"]+)" content="([^"]*)"/gu;
  return new Map(
    [...head.matchAll(pattern)].map((match) => [match[1] ?? '', decodeEntities(match[2] ?? '')]),
  );
}

for (const page of PAGES) {
  test(`${page.path}: Open Graph y tarjeta de X completos para compartir`, async ({ request }) => {
    const response = await request.get(page.path);
    expect(response.status()).toBe(page.status);
    const html = await response.text();

    const headEnd = html.indexOf('</head>');
    expect(headEnd).toBeGreaterThan(0);
    const head = html.slice(0, headEnd);
    expect(Buffer.byteLength(head)).toBeLessThan(HEAD_MAX_BYTES);

    const tags = metaTags(head);
    for (const key of REQUIRED_TAGS) expect(tags.get(key), key).toBeTruthy();
    expect(tags.get('og:type')).toBe('website');
    expect(tags.get('og:locale')).toBe('es_CO');
    expect(tags.get('og:site_name')).toBe(SITE_NAME);
    expect(tags.get('og:title')).not.toContain(SITE_NAME);
    expect(tags.get('og:description')?.length).toBeLessThanOrEqual(SHARE_DESCRIPTION_MAX_LENGTH);
    expect(tags.get('twitter:card')).toBe('summary_large_image');
    expect(tags.get('twitter:title')).toBe(tags.get('og:title'));
    expect(tags.get('twitter:description')).toBe(tags.get('og:description'));

    const canonical = /<link rel="canonical" href="([^"]+)"/u.exec(head)?.[1];
    if (page.status === 404) {
      // La 404 no declara la URL de otra página.
      expect(canonical).toBeUndefined();
      expect(tags.has('og:url')).toBe(false);
    } else {
      expect(tags.get('og:url')).toBe(canonical);
      expect(new URL(tags.get('og:url') ?? '').origin).toBe(CANONICAL_ORIGIN);
      expect(tags.get('og:url')).not.toMatch(/[?#]/u);
    }

    const imageUrl = new URL(tags.get('og:image') ?? '');
    expect(imageUrl.origin).toBe(CANONICAL_ORIGIN);
    expect(tags.get('twitter:image')).toBe(imageUrl.href);

    const image = await request.get(imageUrl.pathname);
    expect(image.status()).toBe(200);
    expect(image.headers()['content-type']).toBe(tags.get('og:image:type'));
    expect((await image.body()).byteLength).toBeLessThanOrEqual(OG_IMAGE_MAX_BYTES);
  });
}
