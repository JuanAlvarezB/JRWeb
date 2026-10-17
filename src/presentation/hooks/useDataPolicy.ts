import { useSuspenseQuery } from '@tanstack/react-query';
import type { LegalDocument } from '@/domain/entities/LegalDocument';
import { useDependencies } from '@/presentation/providers/dependencyContext';
import { queries } from './queries';

/**
 * Política de Tratamiento de Datos con sus secciones (generan el índice). El texto se
 * descarga en un fragmento aparte solo cuando una página usa este hook.
 */
export function useDataPolicy(): LegalDocument {
  return useSuspenseQuery(queries.dataPolicy(useDependencies())).data;
}
