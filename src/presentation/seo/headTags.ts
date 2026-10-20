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

/** Una etiqueta `<meta>` para compartir: Open Graph usa `property`; X, `name`. */
export interface SocialTag {
  readonly attribute: 'property' | 'name';
  readonly key: string;
  readonly content: string;
}

const openGraph = (key: string, content: string): SocialTag => ({
  attribute: 'property',
  key: `og:${key}`,
  content,
});

const twitter = (key: string, content: string): SocialTag => ({
  attribute: 'name',
  key: `twitter:${key}`,
  content,
});

/**
 * Etiquetas para compartir una página (vistas previas de WhatsApp, Facebook, LinkedIn
 * y X): Open Graph completo con la imagen y su texto alternativo, y tarjeta grande de X.
 * Las URL son absolutas y de PDN; la 404 no declara `og:url`.
 *
 * @param meta - Metadatos de la página (`pageMeta`).
 * @returns Las etiquetas en el orden del `<head>`, con el texto sin escapar.
 */
export function socialTags(meta: PageMeta): readonly SocialTag[] {
  return [
    openGraph('type', 'website'),
    openGraph('locale', 'es_CO'),
    openGraph('site_name', UI_TEXT.seo.siteName),
    ...(meta.canonicalUrl === undefined ? [] : [openGraph('url', meta.canonicalUrl)]),
    openGraph('title', meta.shareTitle),
    openGraph('description', meta.shareDescription),
    openGraph('image', OG_IMAGE.url),
    openGraph('image:type', OG_IMAGE.type),
    openGraph('image:width', String(OG_IMAGE.width)),
    openGraph('image:height', String(OG_IMAGE.height)),
    openGraph('image:alt', OG_IMAGE.alt),
    twitter('card', 'summary_large_image'),
    twitter('title', meta.shareTitle),
    twitter('description', meta.shareDescription),
    twitter('image', OG_IMAGE.url),
    twitter('image:alt', OG_IMAGE.alt),
  ];
}

/** `<meta>` de una etiqueta para compartir, con el contenido escapado. */
export function renderSocialTag({ attribute, key, content }: SocialTag): string {
  return `<meta ${attribute}="${key}" content="${escapeHtml(content)}" />`;
}

/**
 * Etiquetas del `<head>` de una página prerenderizada: título, descripción, robots,
 * canónica, etiquetas para compartir (`socialTags`) y JSON-LD.
 *
 * @param meta - Metadatos de la página (`pageMeta`).
 * @param options - Si el ambiente permite indexar y los datos estructurados de la página.
 * @returns Las etiquetas listas para el `<head>`, una por línea.
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
      : [`<link rel="canonical" href="${escapeHtml(meta.canonicalUrl)}" />`]),
    ...socialTags(meta).map(renderSocialTag),
    ...jsonLd.map((data) => `<script type="application/ld+json">${serializeJsonLd(data)}</script>`),
  ];
  return tags.join('\n    ');
}
