import type { QueryClient } from '@tanstack/react-query';
import { Suspense, type JSX } from 'react';
import { BrowserRouter } from 'react-router';
import { PageErrorBoundary } from '@/presentation/components/layout/PageErrorBoundary';
import type { AppDependencies } from '@/presentation/providers/AppDependencies';
import { AppProviders } from '@/presentation/providers/AppProviders';
import { AppRoutes } from '@/presentation/router/AppRoutes';

interface AppProps {
  /** Casos de uso del composition root (`createContainer()` en `main.tsx`). */
  readonly dependencies: AppDependencies;
  /** Cliente de consultas precargado (prerender); si se omite, se crea uno. */
  readonly queryClient?: QueryClient | undefined;
}

/**
 * Raíz de la aplicación en el navegador: providers, router y un Error Boundary
 * general por si falla algo fuera de las páginas (menú o footer).
 */
export function App({ dependencies, queryClient }: AppProps): JSX.Element {
  return (
    <AppProviders dependencies={dependencies} queryClient={queryClient}>
      <BrowserRouter>
        <PageErrorBoundary>
          <Suspense>
            <AppRoutes />
          </Suspense>
        </PageErrorBoundary>
      </BrowserRouter>
    </AppProviders>
  );
}
