import type { QueryClient } from '@tanstack/react-query';
import type { JSX, ReactNode } from 'react';
import type { AppDependencies } from './AppDependencies';
import { DependencyProvider } from './DependencyProvider';
import { QueryProvider } from './QueryProvider';

interface AppProvidersProps {
  readonly dependencies: AppDependencies;
  readonly queryClient?: QueryClient | undefined;
  readonly children: ReactNode;
}

/**
 * Providers de la aplicación en un solo lugar. Los usan `App.tsx`, el prerender y
 * las pruebas de componentes, para que los tres monten el mismo árbol.
 */
export function AppProviders({
  dependencies,
  queryClient,
  children,
}: AppProvidersProps): JSX.Element {
  return (
    <QueryProvider client={queryClient}>
      <DependencyProvider dependencies={dependencies}>{children}</DependencyProvider>
    </QueryProvider>
  );
}
