import { deepFreeze, Issues, isNonEmpty } from '../shared/validation';
import { createCourseHours, type CourseHours } from './CourseHours';
import type { LicenseCategory, ServiceType } from './LicenseCategory';

/**
 * Plan: curso completo de una categoría con su distribución de horas.
 * **No tiene precio**: los precios se consultan por WhatsApp (regla del negocio).
 */
export interface Plan {
  readonly category: LicenseCategory;
  /** Nombre visible (p. ej. "Licencia B1"). */
  readonly name: string;
  readonly description: string;
  readonly serviceType: ServiceType;
  /** Texto de la edad para el eyebrow de la tarjeta (p. ej. "Desde 16 años"). */
  readonly ageRequirement: string;
  readonly hours: CourseHours;
}

/** @throws {InvalidContentError} Si falta un dato o las horas no son válidas. */
export function createPlan(props: Plan): Plan {
  const issues = new Issues(`Plan ${props.category}`);
  issues.check(isNonEmpty(props.name), 'El nombre es obligatorio.');
  issues.check(isNonEmpty(props.description), 'La descripción es obligatoria.');
  issues.check(isNonEmpty(props.ageRequirement), 'El texto de la edad es obligatorio.');
  issues.check(!('price' in props), 'Un plan no puede tener precio publicado.');
  let hours = props.hours;
  issues.include('Horas', () => {
    hours = createCourseHours(props.hours);
  });
  issues.throwIfAny();
  return deepFreeze({ ...props, hours });
}
