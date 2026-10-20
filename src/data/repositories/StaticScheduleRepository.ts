import type { ClassSchedule } from '../../domain/entities/ClassSchedule';
import type { ScheduleRepository } from '../../domain/repositories/ScheduleRepository';
import { mapSchedule } from '../mappers/scheduleMapper';
import { memoize } from './memoize';

/** Implementación de `ScheduleRepository` con el contenido estático del release 1. */
export class StaticScheduleRepository implements ScheduleRepository {
  private readonly load: () => ClassSchedule;

  /** @param source - Contenido del JSON (sin validar; se valida al primer uso). */
  constructor(source: unknown) {
    this.load = memoize(() => mapSchedule(source));
  }

  get(): Promise<ClassSchedule> {
    return Promise.resolve().then(() => this.load());
  }
}
