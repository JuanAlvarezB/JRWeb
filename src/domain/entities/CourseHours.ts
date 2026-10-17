import { deepFreeze, Issues, isNonNegativeInteger } from '../shared/validation';

/** Distribución de horas de un curso: teoría, taller y manejo. */
export interface CourseHours {
  readonly theory: number;
  readonly workshop: number;
  readonly driving: number;
}

/** Proporción de cada parte sobre el total (suman 1). */
export interface CourseHourShares {
  readonly theory: number;
  readonly workshop: number;
  readonly driving: number;
}

/**
 * Crea la distribución de horas.
 *
 * @throws {InvalidContentError} Si alguna parte no es un entero ≥ 0 o el total es 0.
 */
export function createCourseHours(props: CourseHours): CourseHours {
  const issues = new Issues('CourseHours');
  const parts: readonly (readonly [string, number])[] = [
    ['teoría', props.theory],
    ['taller', props.workshop],
    ['manejo', props.driving],
  ];
  for (const [part, hours] of parts) {
    issues.check(isNonNegativeInteger(hours), `Las horas de ${part} deben ser un entero ≥ 0.`);
  }
  issues.check(totalHours(props) > 0, 'El curso debe tener al menos una hora.');
  issues.throwIfAny();
  return deepFreeze({ theory: props.theory, workshop: props.workshop, driving: props.driving });
}

/** Total de horas del curso. */
export function totalHours(hours: CourseHours): number {
  return hours.theory + hours.workshop + hours.driving;
}

/** Proporciones para el arco del velocímetro (tramos proporcionales). */
export function hourShares(hours: CourseHours): CourseHourShares {
  const total = totalHours(hours);
  return {
    theory: hours.theory / total,
    workshop: hours.workshop / total,
    driving: hours.driving / total,
  };
}
