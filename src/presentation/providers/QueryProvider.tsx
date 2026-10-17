import { QueryClientProvider, type QueryClient } from '@tanstack/react-query';
import { useState, type JSX, type ReactNode } from 'react';
import { createQueryClient } from './queryClient';

interface QueryProviderProps {
  /**
   * Cliente ya creado: lo usan las pruebas (uno nuevo por prueba) y el prerender
   * (con las consultas precargadas). Si se omite, se crea uno.
   */
  readonly client?: QueryClient | undefined;
  readonly children: ReactNode;
}

/** Caché de consultas de TanStack Query: cada caso de uso se ejecuta una vez por visita. */
export function QueryProvider({ client, children }: QueryProviderProps): JSX.Element {
  // Un cliente por montaje, estable entre renders (en el servidor, uno por página).
  const [queryClient] = useState(() => client ?? createQueryClient());
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
