import { ROUTES } from '@/shared/constants/routes';
import { CANONICAL_ORIGIN } from '@/shared/constants/site';
import { UI_TEXT } from '@/shared/constants/uiText';

/** Páginas del sitio (cada una con sus metadatos). */
export type PageKey =
  'home' | 'about' | 'services' | 'plans' | 'contact' | 'faq' | 'dataPolicy' | 'notFound';

/** Metadatos de una página para buscadores y redes sociales. */
export interface PageMeta {
  readonly key: PageKey;
  /** Título de la pestaña y de los buscadores, con el nombre del sitio. */
  readonly title: string;
  /** Descripción para buscadores (máx. ~160 caracteres). */
  readonly description: string;
  /** Título al compartir (Open Graph y X), sin el nombre del sitio. */
  readonly shareTitle: string;
  /** Descripción al compartir (máx. `SHARE_DESCRIPTION_MAX_LENGTH` caracteres). */
  readonly shareDescription: string;
  /** URL canónica (siempre PDN); `undefined` en la 404. */
  readonly canonicalUrl: string | undefined;
  /** `false` en la 404: no se indexa. QA tampoco se indexa (`robots.txt` y encabezado). */
  readonly indexable: boolean;
}

/** Largo máximo de la descripción al compartir: WhatsApp corta las más largas. */
export const SHARE_DESCRIPTION_MAX_LENGTH = 80;

const OG_IMAGE_PATH = '/og-image.png';

/**
 * Imagen para compartir en redes: `public/og-image.png`, PNG de 1200 × 630 (1.91:1) y
 * máx. 250 KB (lo verifica `tests/unit/presentation/ogImage.test.ts`). La URL es
 * absoluta y de PDN, como la canónica.
 */
export const OG_IMAGE = {
  path: OG_IMAGE_PATH,
  url: `${CANONICAL_ORIGIN}${OG_IMAGE_PATH}`,
  type: 'image/png',
  width: 1200,
  height: 630,
  alt: UI_TEXT.seo.ogImageAlt,
} as const;

const { pages: PAGES, seo: SEO } = UI_TEXT;

const PAGE_PATHS: Record<Exclude<PageKey, 'notFound'>, string> = {
  home: ROUTES.home,
  about: ROUTES.about,
  services: ROUTES.services,
  plans: ROUTES.plans,
  contact: ROUTES.contact,
  faq: ROUTES.faq,
  dataPolicy: ROUTES.dataPolicy,
};

const PAGE_TITLES: Record<PageKey, string> = {
  home: PAGES.home.documentTitle,
  about: PAGES.documentTitle(PAGES.about.title),
  services: PAGES.documentTitle(PAGES.services.title),
  plans: PAGES.documentTitle(PAGES.plans.title),
  contact: PAGES.documentTitle(PAGES.contact.title),
  faq: PAGES.documentTitle(PAGES.faq.title),
  dataPolicy: PAGES.documentTitle(PAGES.dataPolicy.title),
  notFound: PAGES.documentTitle(PAGES.notFound.documentTitle),
};

const SHARE_TITLES: Record<PageKey, string> = {
  ...SEO.share.titles,
  contact: PAGES.contact.title,
  faq: PAGES.faq.title,
  dataPolicy: PAGES.dataPolicy.title,
  notFound: PAGES.notFound.documentTitle,
};

/** URL canónica de una ruta: `/` → `https://…/`, `/planes` → `https://…/planes`. */
export function canonicalUrl(path: string): string {
  return path === ROUTES.home ? `${CANONICAL_ORIGIN}/` : `${CANONICAL_ORIGIN}${path}`;
}

/** Metadatos de una página. Los textos no repiten cifras del contenido para no desactualizarse. */
export function pageMeta(key: PageKey): PageMeta {
  return {
    key,
    title: PAGE_TITLES[key],
    description: SEO.descriptions[key],
    shareTitle: SHARE_TITLES[key],
    shareDescription: SEO.share.descriptions[key],
    canonicalUrl: key === 'notFound' ? undefined : canonicalUrl(PAGE_PATHS[key]),
    indexable: key !== 'notFound',
  };
}
