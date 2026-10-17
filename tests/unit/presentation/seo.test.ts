import { existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { escapeHtml, renderHeadTags, serializeJsonLd } from '@/presentation/seo/headTags';
import { canonicalUrl, pageMeta, type PageKey } from '@/presentation/seo/pageMeta';
import {
  NOT_FOUND_PATH,
  outputFileFor,
  PAGE_KEY_BY_PATH,
  PRERENDER_TARGETS,
} from '@/presentation/seo/prerenderTargets';
import { drivingSchoolJsonLd, faqPageJsonLd, SCHOOL_ID } from '@/presentation/seo/structuredData';
import { ROUTES } from '@/shared/constants/routes';
import { CANONICAL_ORIGIN } from '@/shared/constants/site';
import { channels, company, faqs, location, plans } from '../domain/samples';

const KEYS: readonly PageKey[] = [
  'home',
  'about',
  'services',
  'plans',
  'contact',
  'faq',
  'dataPolicy',
  'notFound',
];

describe('pageMeta', () => {
  it('cada página tiene título con la marca y descripción de máximo 160 caracteres', () => {
    for (const key of KEYS) {
      const meta = pageMeta(key);
      expect(meta.title).toMatch(/Conducir J&R del Sinú/u);
      expect(meta.description.length).toBeGreaterThan(50);
      expect(meta.description.length).toBeLessThanOrEqual(160);
    }
  });

  it('las descripciones no repiten precios ni cifras de horas del contenido', () => {
    for (const key of KEYS) expect(pageMeta(key).description).not.toMatch(/\$|\d+\s*horas/u);
  });

  it('canónica siempre en PDN, sin barra final salvo en Inicio; la 404 no se indexa', () => {
    expect(pageMeta('home').canonicalUrl).toBe(`${CANONICAL_ORIGIN}/`);
    expect(pageMeta('plans').canonicalUrl).toBe(`${CANONICAL_ORIGIN}/planes`);
    expect(canonicalUrl(ROUTES.faq)).toBe(`${CANONICAL_ORIGIN}/preguntas-frecuentes`);
    expect(pageMeta('notFound')).toMatchObject({ canonicalUrl: undefined, indexable: false });
  });
});

describe('datos estructurados', () => {
  const school = drivingSchoolJsonLd({ company, location, channels, plans });

  it('DrivingSchool con NIT, dirección en Colombia, coordenadas y contacto', () => {
    expect(school).toMatchObject({
      '@type': 'DrivingSchool',
      '@id': SCHOOL_ID,
      name: company.brandName,
      taxID: '901722359-5',
      telephone: '+573165641048',
      email: 'conducirdelsinu@gmail.com',
      address: { addressLocality: 'Cereté', addressRegion: 'Córdoba', addressCountry: 'CO' },
      geo: { latitude: 8.8877998, longitude: -75.7887601 },
      hasMap: location.googleProfileUrl,
    });
    expect(school.sameAs).toEqual([
      'https://www.instagram.com/ceaconducirjrdelsinu/',
      location.googleProfileUrl,
    ]);
  });

  it('un curso por plan, sin precios ni calificación', () => {
    const catalog = school.hasOfferCatalog as { itemListElement: unknown[] };
    expect(catalog.itemListElement).toHaveLength(plans.length);
    const json = JSON.stringify(school);
    expect(json).not.toMatch(/"price|aggregateRating|ratingValue/u);
  });

  it('sin coordenadas ni teléfono, omite esos campos', () => {
    const minimal = drivingSchoolJsonLd({
      company,
      location: { ...location, coordinates: undefined, googleProfileUrl: undefined },
      channels: [],
      plans: [],
    });
    expect(minimal).not.toHaveProperty('geo');
    expect(minimal).not.toHaveProperty('telephone');
    expect(minimal).not.toHaveProperty('hasMap');
    expect(minimal.sameAs).toEqual([]);
  });

  it('FAQPage con cada pregunta y su respuesta', () => {
    const faqPage = faqPageJsonLd(faqs);
    expect(faqPage.mainEntity).toHaveLength(faqs.length);
    expect(JSON.stringify(faqPage)).toContain('"@type":"Answer"');
  });
});

describe('renderHeadTags', () => {
  it('PDN indexa; fuera de PDN, noindex en todas las páginas', () => {
    expect(renderHeadTags(pageMeta('plans'), { indexingAllowed: true })).toContain(
      '<meta name="robots" content="index, follow" />',
    );
    expect(renderHeadTags(pageMeta('plans'), { indexingAllowed: false })).toContain(
      'content="noindex, nofollow"',
    );
    expect(renderHeadTags(pageMeta('notFound'), { indexingAllowed: true })).toContain(
      'content="noindex, nofollow"',
    );
  });

  it('título, canónica, Open Graph y JSON-LD escapados', () => {
    const head = renderHeadTags(pageMeta('faq'), {
      indexingAllowed: true,
      jsonLd: [{ '@type': 'Thing', name: '</script><script>alert(1)</script>' }],
    });
    expect(head).toContain('<title>Preguntas frecuentes · Conducir J&amp;R del Sinú</title>');
    expect(head).toContain(
      `<link rel="canonical" href="${CANONICAL_ORIGIN}/preguntas-frecuentes" />`,
    );
    expect(head).toContain('<meta property="og:image:width" content="1200" />');
    expect(head).not.toContain('</script><script>');
    expect(head.match(/<\/script>/gu)).toHaveLength(1);
  });

  it('escapeHtml y serializeJsonLd', () => {
    expect(escapeHtml('a & "b" <c>')).toBe('a &amp; &quot;b&quot; &lt;c&gt;');
    expect(serializeJsonLd({ x: '<' })).toBe('{"x":"\\u003c"}');
  });
});

describe('páginas a prerenderizar', () => {
  it('todas las rutas públicas más la 404, con archivo .html sin carpeta', () => {
    expect(PRERENDER_TARGETS.map((target) => target.path)).toEqual([
      ...Object.values(ROUTES),
      NOT_FOUND_PATH,
    ]);
    expect(outputFileFor('/')).toBe('index.html');
    expect(outputFileFor('/planes')).toBe('planes.html');
    expect(PRERENDER_TARGETS.at(-1)).toMatchObject({ file: '404.html', inSitemap: false });
  });

  it('cada página tiene metadatos y un módulo que existe', () => {
    for (const target of PRERENDER_TARGETS) {
      expect(PAGE_KEY_BY_PATH[target.path]).toBeDefined();
      expect(existsSync(target.module)).toBe(true);
    }
  });
});
