import { render, type RenderResult } from '@testing-library/react';
import { Suspense } from 'react';
import { MemoryRouter } from 'react-router';
import { createContainer } from '@/di/container';
import type { AppDependencies } from '@/presentation/providers/AppDependencies';
import { AppProviders } from '@/presentation/providers/AppProviders';
import { createQueryClient } from '@/presentation/providers/queryClient';
import { AppRoutes } from '@/presentation/router/AppRoutes';

/** Monta el sitio completo (layout y rutas) en una ruta, como en el navegador. */
export function renderRoute(
  path: string,
  dependencies: AppDependencies = createContainer(),
): RenderResult {
  return render(
    <AppProviders dependencies={dependencies} queryClient={createQueryClient()}>
      <MemoryRouter initialEntries={[path]}>
        <Suspense>
          <AppRoutes />
        </Suspense>
      </MemoryRouter>
    </AppProviders>,
  );
}
