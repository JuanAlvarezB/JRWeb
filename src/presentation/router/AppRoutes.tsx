import { lazy, type JSX } from 'react';
import { Route, Routes } from 'react-router';
import { SiteLayout } from '@/presentation/components/layout/SiteLayout';
import { ROUTES } from '@/shared/constants/routes';

/** Cada página es un fragmento aparte: se descarga solo al visitarla. */
const HomePage = lazy(() => import('@/presentation/pages/HomePage'));
const AboutPage = lazy(() => import('@/presentation/pages/AboutPage'));
const ServicesPage = lazy(() => import('@/presentation/pages/ServicesPage'));
const PlansPage = lazy(() => import('@/presentation/pages/PlansPage'));
const ContactPage = lazy(() => import('@/presentation/pages/ContactPage'));
const FaqPage = lazy(() => import('@/presentation/pages/FaqPage'));
const DataPolicyPage = lazy(() => import('@/presentation/pages/DataPolicyPage'));
const NotFoundPage = lazy(() => import('@/presentation/pages/NotFoundPage'));

/** Catálogo de componentes: solo existe en DEV (Vite lo elimina de QA y PDN). */
const ComponentCatalog = import.meta.env.DEV
  ? lazy(() => import('@/presentation/dev/ComponentCatalog'))
  : null;

/** Ruta del catálogo de componentes en DEV. */
export const DEV_CATALOG_PATH = '/dev/componentes';

/**
 * Rutas del sitio. Las usan `App.tsx` (navegador) y el prerender (servidor), así las
 * dos versiones generan las mismas páginas.
 */
export function AppRoutes(): JSX.Element {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route index element={<HomePage />} />
        <Route path={ROUTES.about} element={<AboutPage />} />
        <Route path={ROUTES.services} element={<ServicesPage />} />
        <Route path={ROUTES.plans} element={<PlansPage />} />
        <Route path={ROUTES.contact} element={<ContactPage />} />
        <Route path={ROUTES.faq} element={<FaqPage />} />
        <Route path={ROUTES.dataPolicy} element={<DataPolicyPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
      {ComponentCatalog !== null && (
        <Route path={DEV_CATALOG_PATH} element={<ComponentCatalog />} />
      )}
    </Routes>
  );
}
