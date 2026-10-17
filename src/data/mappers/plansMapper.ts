import { createPlan, type Plan } from '../../domain/entities/Plan';
import { InvalidContentError } from '../../domain/errors/InvalidContentError';
import { findDuplicates } from '../../domain/shared/validation';
import { parseContent } from '../schemas/parseContent';
import { plansSchema } from '../schemas/plansSchema';

/** `plans.json` → planes validados (sin precio), una sola vez por categoría. */
export function mapPlans(raw: unknown): Plan[] {
  const plans = parseContent(plansSchema, raw, 'plans.json').map(createPlan);
  const duplicated = findDuplicates(plans.map((plan) => plan.category));
  if (duplicated.length > 0) {
    throw new InvalidContentError('plans.json', [
      `Categorías repetidas: ${duplicated.join(', ')}.`,
    ]);
  }
  return plans;
}
