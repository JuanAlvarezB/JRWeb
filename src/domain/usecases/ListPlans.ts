import type { LicenseCategory } from '../entities/LicenseCategory';
import { sortByCategory } from '../entities/LicenseCategory';
import type { Plan } from '../entities/Plan';
import { NotFoundError } from '../errors/NotFoundError';
import type { PlanRepository } from '../repositories/PlanRepository';

/** Lista los planes (sin precios) en el orden de las categorías. */
export class ListPlans {
  constructor(private readonly plans: PlanRepository) {}

  /** @returns Los planes ordenados por categoría (A2, B1, C1). */
  async execute(): Promise<readonly Plan[]> {
    return sortByCategory(await this.plans.list());
  }

  /**
   * Plan de una categoría (selector "Tu curso en horas").
   *
   * @throws {NotFoundError} Si la escuela no ofrece esa categoría.
   */
  async byCategory(category: LicenseCategory): Promise<Plan> {
    const plan = (await this.plans.list()).find((item) => item.category === category);
    if (plan === undefined) throw new NotFoundError('Plan', category);
    return plan;
  }
}
