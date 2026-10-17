import type { Plan } from '../entities/Plan';

/**
 * Fuente de los planes (cursos con su distribución de horas, sin precios).
 * Release 1: archivo JSON. Fase 2: tabla en Supabase.
 */
export interface PlanRepository {
  /** @returns Todos los planes validados, en cualquier orden. */
  list(): Promise<readonly Plan[]>;
}
