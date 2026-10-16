import { lazy, Suspense, type JSX } from 'react';
import { BrowserRouter } from 'react-router';
import { appConfig } from '@/shared/config/env';
import { UI_TEXT } from '@/shared/constants/uiText';

/** Catálogo de componentes: solo existe en DEV (Vite lo elimina de QA y PDN). */
const ComponentCatalog = import.meta.env.DEV
  ? lazy(() => import('@/presentation/dev/ComponentCatalog'))
  : null;

/**
 * Raíz de la aplicación.
 * Etapas 1–3: muestra el catálogo de componentes en DEV. El router, los providers
 * y el layout del sitio llegan en las etapas siguientes.
 */
export function App(): JSX.Element {
  if (ComponentCatalog !== null) {
    return (
      <BrowserRouter>
        <Suspense>
          <ComponentCatalog />
        </Suspense>
      </BrowserRouter>
    );
  }

  return (
    <main>
      <h1>{UI_TEXT.brand.name}</h1>
      <p>{UI_TEXT.brand.tagline}</p>
      <p>{UI_TEXT.setup.environmentReady(appConfig.envName)}</p>
    </main>
  );
}
