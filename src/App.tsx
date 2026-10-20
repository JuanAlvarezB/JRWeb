import type { QueryClient } from '@tanstack/react-query';
import { Suspense, type JSX } from 'react';
import { BrowserRouter } from 'react-router';
import { PageErrorBoundary } from '@/presentation/components/layout/PageErrorBoundary';
import type { AppDependencies } from '@/presentation/providers/AppDependencies';
import { AppProviders } from '@/presentation/providers/AppProviders';
import { AppRoutes } from '@/presentation/router/AppRoutes';

/**
 * Contenido de la aplicación dentro del router: un Error Boundary general (por si
 * falla el menú o el footer) y las rutas. Lo comparten el navegador (`App`) y el
 * prerender (`entry-server.tsx`): el HTML generado y el hidratado son el mismo árbol.
 */
export function AppContent(): JSX.Element {
  return (
    <PageErrorBoundary>
      <Suspense>
        <AppRoutes />
      </Suspense>
    </PageErrorBoundary>
  );
}

interface AppProps {
  /** Casos de uso del composition root (`createContainer()` en `main.tsx`). */
  readonly dependencies: AppDependencies;
  /** Cliente de consultas con la caché del prerender; si se omite, se crea uno. */
  readonly queryClient?: QueryClient | undefined;
}

/** Raíz de la aplicación en el navegador: providers y router. */
export function App({ dependencies, queryClient }: AppProps): JSX.Element {
  return (
    <AppProviders dependencies={dependencies} queryClient={queryClient}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AppProviders>
  );
}
