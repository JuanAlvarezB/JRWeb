import { useSuspenseQuery } from '@tanstack/react-query';
import type { ClassSchedule } from '@/domain/entities/ClassSchedule';
import { useDependencies } from '@/presentation/providers/dependencyContext';
import { queries } from './queries';

/** Horarios de clases teóricas (diurnas y nocturnas) y prácticas. */
export function useSchedule(): ClassSchedule {
  return useSuspenseQuery(queries.schedule(useDependencies())).data;
}
