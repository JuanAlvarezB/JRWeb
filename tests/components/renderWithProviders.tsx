import { render, type RenderResult } from '@testing-library/react';
import { Suspense, type ReactElement } from 'react';
import { MemoryRouter } from 'react-router';
import { createContainer } from '@/di/container';
import type { AppDependencies } from '@/presentation/providers/AppDependencies';
import { AppProviders } from '@/presentation/providers/AppProviders';
import { createQueryClient } from '@/presentation/providers/queryClient';

/**
 * Monta un componente como en el sitio: providers reales (contenido real por
 * defecto), router y Suspense. Las pruebas esperan el contenido con `findBy…`.
 */
export function renderWithProviders(
  ui: ReactElement,
  dependencies: AppDependencies = createContainer(),
): RenderResult {
  return render(
    <AppProviders dependencies={dependencies} queryClient={createQueryClient()}>
      <MemoryRouter>
        <Suspense fallback={<p>Cargando</p>}>{ui}</Suspense>
      </MemoryRouter>
    </AppProviders>,
  );
}
