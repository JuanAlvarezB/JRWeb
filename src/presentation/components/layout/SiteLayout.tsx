import { Suspense, type JSX } from 'react';
import { Outlet, useLocation } from 'react-router';
import { EnvironmentBadge } from './EnvironmentBadge';
import { FloatingActions } from './FloatingActions';
import { Footer } from './Footer';
import { Header } from './Header';
import { PageErrorBoundary } from './PageErrorBoundary';
import { PageFallback } from './PageFallback';
import { ScrollManager } from './ScrollManager';
import styles from './SiteLayout.module.css';
import { MAIN_CONTENT_ID, SkipLink } from './SkipLink';

/**
 * Estructura común de todas las páginas: menú, contenido, footer y elementos
 * flotantes. Cada página tiene su propio Error Boundary y su espera de carga, así un
 * fallo o una carga lenta no se llevan el menú.
 */
export function SiteLayout(): JSX.Element {
  const { pathname } = useLocation();

  return (
    <>
      <SkipLink />
      <EnvironmentBadge />
      <Header />
      <main id={MAIN_CONTENT_ID} tabIndex={-1} className={styles.main}>
        <PageErrorBoundary resetKey={pathname}>
          <Suspense fallback={<PageFallback />}>
            <Outlet />
          </Suspense>
        </PageErrorBoundary>
      </main>
      <Footer />
      <FloatingActions />
      <ScrollManager />
    </>
  );
}
