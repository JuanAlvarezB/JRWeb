import { z } from '../../shared/config/zod';
import { WEEKDAYS } from '../../domain/entities/ClassSchedule';
import { text } from './common';

/** Esquema de `schedule.json`. Horas en formato 24 h (HH:MM). */
export const scheduleSchema = z.strictObject({
  blocks: z.array(
    z.strictObject({
      id: z.enum(['theory-day', 'theory-night', 'practice']),
      kind: z.enum(['theory', 'practice']),
      days: z.array(z.enum(WEEKDAYS)),
      slots: z.array(z.strictObject({ start: text, end: text })),
      note: text.optional(),
    }),
  ),
});
