import type { ClassSchedule } from '../entities/ClassSchedule';

/** Fuente de los horarios de clases. */
export interface ScheduleRepository {
  /** @returns Los horarios validados. */
  get(): Promise<ClassSchedule>;
}
