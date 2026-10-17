import type { JSX, ReactNode } from 'react';
import type { AppDependencies } from './AppDependencies';
import { DependencyContext } from './dependencyContext';

interface DependencyProviderProps {
  /** Casos de uso ya construidos por el composition root (`src/di/container.ts`). */
  readonly dependencies: AppDependencies;
  readonly children: ReactNode;
}

/**
 * Inyección de dependencias por Context: entrega los casos de uso a los hooks sin
 * que la presentación importe `data/` ni el contenedor. En las pruebas se le pasan
 * casos de uso con repositorios en memoria.
 */
export function DependencyProvider({
  dependencies,
  children,
}: DependencyProviderProps): JSX.Element {
  return <DependencyContext.Provider value={dependencies}>{children}</DependencyContext.Provider>;
}
