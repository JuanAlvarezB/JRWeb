import { useSuspenseQuery } from '@tanstack/react-query';
import type { Plan } from '@/domain/entities/Plan';
import { useDependencies } from '@/presentation/providers/dependencyContext';
import { queries } from './queries';

/**
 * Planes con su distribución de horas, en orden A2, B1, C1 y sin precios. El selector
 * "Tu curso en horas" cambia de plan sin una consulta nueva.
 */
export function usePlans(): readonly Plan[] {
  return useSuspenseQuery(queries.plans(useDependencies())).data;
}
