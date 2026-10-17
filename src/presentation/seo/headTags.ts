import { UI_TEXT } from '@/shared/constants/uiText';
import { OG_IMAGE, type PageMeta } from './pageMeta';
import type { JsonLd } from './structuredData';

/** Escapa texto para HTML (contenido y atributos entre comillas dobles). */
export function escapeHtml(text: string): string {
  return text
    .replace(/&/gu, '&amp;')
    .replace(/</gu, '&lt;')
    .replace(/>/gu, '&gt;')
    .replace(/"/gu, '&quot;');
}

/** JSON-LD dentro de `<script>`: `<` escapado para que los datos no cierren la etiqueta. */
export function serializeJsonLd(data: JsonLd): string {
  return JSON.stringify(data).replace(/</gu, '\\u003c');
}

export interface HeadOptions {
  /** `false` fuera de PDN: todas las páginas llevan `noindex`. */
  readonly indexingAllowed: boolean;
  readonly jsonLd?: readonly JsonLd[];
}

/**
 * Etiquetas del `<head>` de una página prerenderizada: título, descripción, robots,
 * canónica, Open Graph, tarjeta de X y JSON-LD.
 */
export function renderHeadTags(
  meta: PageMeta,
  { indexingAllowed, jsonLd = [] }: HeadOptions,
): string {
  const robots = indexingAllowed && meta.indexable ? 'index, follow' : 'noindex, nofollow';
  const tags = [
    `<title>${escapeHtml(meta.title)}</title>`,
    `<meta name="description" content="${escapeHtml(meta.description)}" />`,
    `<meta name="robots" content="${robots}" />`,
    ...(meta.canonicalUrl === undefined
      ? []
      : [
          `<link rel="canonical" href="${escapeHtml(meta.canonicalUrl)}" />`,
          `<meta property="og:url" content="${escapeHtml(meta.canonicalUrl)}" />`,
        ]),
    '<meta property="og:type" content="website" />',
    '<meta property="og:locale" content="es_CO" />',
    `<meta property="og:site_name" content="${escapeHtml(UI_TEXT.seo.siteName)}" />`,
    `<meta property="og:title" content="${escapeHtml(meta.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(meta.description)}" />`,
    `<meta property="og:image" content="${OG_IMAGE.url}" />`,
    `<meta property="og:image:width" content="${String(OG_IMAGE.width)}" />`,
    `<meta property="og:image:height" content="${String(OG_IMAGE.height)}" />`,
    `<meta property="og:image:alt" content="${escapeHtml(UI_TEXT.seo.ogImageAlt)}" />`,
    '<meta name="twitter:card" content="summary_large_image" />',
    ...jsonLd.map((data) => `<script type="application/ld+json">${serializeJsonLd(data)}</script>`),
  ];
  return tags.join('\n    ');
}
