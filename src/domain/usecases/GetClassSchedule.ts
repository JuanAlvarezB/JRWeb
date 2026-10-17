import type { ClassSchedule } from '../entities/ClassSchedule';
import type { ScheduleRepository } from '../repositories/ScheduleRepository';

/** Obtiene los horarios de clases (Contáctanos, ubicación, hero, Nosotros y footer). */
export class GetClassSchedule {
  constructor(private readonly schedule: ScheduleRepository) {}

  /** @returns Los horarios de clases. */
  execute(): Promise<ClassSchedule> {
    return this.schedule.get();
  }
}
