import { createContext, useContext } from 'react';
import type { AppDependencies } from './AppDependencies';

export const DependencyContext = createContext<AppDependencies | null>(null);

/**
 * Casos de uso inyectados por el `DependencyProvider`. Solo lo usan los hooks de
 * datos (`presentation/hooks/`); los componentes usan esos hooks.
 *
 * @throws {Error} Si se usa fuera del `DependencyProvider`.
 */
export function useDependencies(): AppDependencies {
  const dependencies = useContext(DependencyContext);
  if (dependencies === null) {
    throw new Error('useDependencies debe usarse dentro de <DependencyProvider>.');
  }
  return dependencies;
}
