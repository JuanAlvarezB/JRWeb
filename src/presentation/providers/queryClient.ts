import { QueryClient } from '@tanstack/react-query';
import { DomainError } from '@/domain/errors/DomainError';

/**
 * Reintentos ante fallas técnicas (p. ej. no se pudo descargar el fragmento de la
 * política de datos por una conexión inestable).
 */
export const MAX_QUERY_RETRIES = 2;

/**
 * Un error del dominio (contenido inválido, categoría inexistente) da lo mismo en
 * cada intento: no se reintenta. Las fallas técnicas sí.
 */
export function shouldRetryQuery(failureCount: number, error: Error): boolean {
  return !(error instanceof DomainError) && failureCount < MAX_QUERY_RETRIES;
}

/**
 * Cliente de TanStack Query para el release 1. El contenido es estático y cambia solo
 * con un despliegue, que recarga la página: una consulta resuelta no vuelve a pedirse
 * (`staleTime: Infinity`). En la fase 2, las consultas a Supabase definen su propio
 * `staleTime` en cada hook, sin cambiar este valor por defecto.
 */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Number.POSITIVE_INFINITY,
        retry: shouldRetryQuery,
      },
    },
  });
}
