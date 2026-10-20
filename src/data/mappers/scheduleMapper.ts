import { createClassSchedule, type ClassSchedule } from '../../domain/entities/ClassSchedule';
import { parseContent } from '../schemas/parseContent';
import { scheduleSchema } from '../schemas/scheduleSchema';

/** `schedule.json` → horarios de clases validados. */
export function mapSchedule(raw: unknown): ClassSchedule {
  return createClassSchedule(parseContent(scheduleSchema, raw, 'schedule.json'));
}
