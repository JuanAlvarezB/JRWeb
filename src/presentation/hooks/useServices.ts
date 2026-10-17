import { useSuspenseQuery } from '@tanstack/react-query';
import type { Service } from '@/domain/entities/Service';
import { useDependencies } from '@/presentation/providers/dependencyContext';
import { queries } from './queries';

/** Servicios (cursos por categoría) en orden A2, B1, C1. */
export function useServices(): readonly Service[] {
  return useSuspenseQuery(queries.services(useDependencies())).data;
}
