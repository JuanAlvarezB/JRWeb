import type { QueryClient } from '@tanstack/react-query';
import { lazy, Suspense, type JSX } from 'react';
import { BrowserRouter } from 'react-router';
import type { AppDependencies } from '@/presentation/providers/AppDependencies';
import { AppProviders } from '@/presentation/providers/AppProviders';
import { appConfig } from '@/shared/config/env';
import { UI_TEXT } from '@/shared/constants/uiText';

/** Catálogo de componentes: solo existe en DEV (Vite lo elimina de QA y PDN). */
const ComponentCatalog = import.meta.env.DEV
  ? lazy(() => import('@/presentation/dev/ComponentCatalog'))
  : null;

interface AppProps {
  /** Casos de uso del composition root (`createContainer()` en `main.tsx`). */
  readonly dependencies: AppDependencies;
  /** Cliente de consultas precargado (prerender); si se omite, se crea uno. */
  readonly queryClient?: QueryClient | undefined;
}

/**
 * Raíz de la aplicación: monta los providers.
 * Mientras llegan el router y las páginas, muestra el catálogo de componentes en DEV.
 */
export function App({ dependencies, queryClient }: AppProps): JSX.Element {
  return (
    <AppProviders dependencies={dependencies} queryClient={queryClient}>
      {ComponentCatalog === null ? (
        <main>
          <h1>{UI_TEXT.brand.name}</h1>
          <p>{UI_TEXT.brand.tagline}</p>
          <p>{UI_TEXT.setup.environmentReady(appConfig.envName)}</p>
        </main>
      ) : (
        <BrowserRouter>
          <Suspense>
            <ComponentCatalog />
          </Suspense>
        </BrowserRouter>
      )}
    </AppProviders>
  );
}
