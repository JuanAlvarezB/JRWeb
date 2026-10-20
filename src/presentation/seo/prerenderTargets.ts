import { ROUTES, type RoutePath } from '@/shared/constants/routes';
import type { PrerenderTarget } from '@/shared/prerender';
import type { PageKey } from './pageMeta';

/** Ruta interna que se renderiza para generar `404.html` (no existe en el sitio). */
export const NOT_FOUND_PATH = '/404';

/** Archivo de salida: `/` → `index.html`; `/planes` → `planes.html` (Pages lo sirve en `/planes`). */
export function outputFileFor(path: string): string {
  return path === ROUTES.home ? 'index.html' : `${path.slice(1)}.html`;
}

/** Página de cada ruta prerenderizada. */
export const PAGE_KEY_BY_PATH: Readonly<Record<string, PageKey>> = {
  [ROUTES.home]: 'home',
  [ROUTES.about]: 'about',
  [ROUTES.services]: 'services',
  [ROUTES.plans]: 'plans',
  [ROUTES.contact]: 'contact',
  [ROUTES.faq]: 'faq',
  [ROUTES.dataPolicy]: 'dataPolicy',
  [NOT_FOUND_PATH]: 'notFound',
};

/** Módulo de cada página (coincide con los `import()` de `router/AppRoutes.tsx`). */
const PAGES_DIR = 'src/presentation/pages';
const PAGE_MODULES: Readonly<Record<RoutePath, string>> = {
  [ROUTES.home]: `${PAGES_DIR}/HomePage.tsx`,
  [ROUTES.about]: `${PAGES_DIR}/AboutPage.tsx`,
  [ROUTES.services]: `${PAGES_DIR}/ServicesPage.tsx`,
  [ROUTES.plans]: `${PAGES_DIR}/PlansPage.tsx`,
  [ROUTES.contact]: `${PAGES_DIR}/ContactPage.tsx`,
  [ROUTES.faq]: `${PAGES_DIR}/FaqPage.tsx`,
  [ROUTES.dataPolicy]: `${PAGES_DIR}/DataPolicyPage.tsx`,
};

const PUBLIC_ROUTES: readonly RoutePath[] = Object.values(ROUTES);

/** Todas las páginas que se generan como HTML estático, más la 404. */
export const PRERENDER_TARGETS: readonly PrerenderTarget[] = [
  ...PUBLIC_ROUTES.map((path) => ({
    path,
    file: outputFileFor(path),
    inSitemap: true,
    module: PAGE_MODULES[path],
  })),
  {
    path: NOT_FOUND_PATH,
    file: '404.html',
    inSitemap: false,
    module: `${PAGES_DIR}/NotFoundPage.tsx`,
  },
];
