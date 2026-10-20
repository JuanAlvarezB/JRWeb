import type { Plan } from '../../domain/entities/Plan';
import type { PlanRepository } from '../../domain/repositories/PlanRepository';
import { mapPlans } from '../mappers/plansMapper';
import { memoize } from './memoize';

/** Implementación de `PlanRepository` con el contenido estático del release 1. */
export class StaticPlanRepository implements PlanRepository {
  private readonly load: () => readonly Plan[];

  /** @param source - Contenido del JSON (sin validar; se valida al primer uso). */
  constructor(source: unknown) {
    this.load = memoize(() => mapPlans(source));
  }

  list(): Promise<readonly Plan[]> {
    return Promise.resolve().then(() => this.load());
  }
}
