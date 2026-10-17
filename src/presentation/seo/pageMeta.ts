import { ROUTES } from '@/shared/constants/routes';
import { CANONICAL_ORIGIN } from '@/shared/constants/site';
import { UI_TEXT } from '@/shared/constants/uiText';

/** Páginas del sitio (cada una con sus metadatos). */
export type PageKey =
  'home' | 'about' | 'services' | 'plans' | 'contact' | 'faq' | 'dataPolicy' | 'notFound';

/** Metadatos de una página para buscadores y redes sociales. */
export interface PageMeta {
  readonly key: PageKey;
  readonly title: string;
  readonly description: string;
  /** URL canónica (siempre PDN); `undefined` en la 404. */
  readonly canonicalUrl: string | undefined;
  /** `false` en la 404: no se indexa. QA tampoco se indexa (`robots.txt` y encabezado). */
  readonly indexable: boolean;
}

/** Imagen para compartir en redes (1200 × 630). */
export const OG_IMAGE = {
  url: `${CANONICAL_ORIGIN}/og-image.png`,
  width: 1200,
  height: 630,
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
    canonicalUrl: key === 'notFound' ? undefined : canonicalUrl(PAGE_PATHS[key]),
    indexable: key !== 'notFound',
  };
}
