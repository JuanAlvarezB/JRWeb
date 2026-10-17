import { deepFreeze, findDuplicates, Issues, isNonEmpty } from '../shared/validation';

export const WEEKDAYS = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const;

export type Weekday = (typeof WEEKDAYS)[number];

/** Franja horaria en formato 24 h ("08:00" a "10:00"). */
export interface TimeRange {
  readonly start: string;
  readonly end: string;
}

export type ScheduleBlockId = 'theory-day' | 'theory-night' | 'practice';

/** Bloque de clases: días y franjas. Las prácticas no tienen franjas fijas. */
export interface ScheduleBlock {
  readonly id: ScheduleBlockId;
  readonly kind: 'theory' | 'practice';
  readonly days: readonly Weekday[];
  readonly slots: readonly TimeRange[];
  /** Nota visible (p. ej. "Escríbenos para coordinar tus clases de manejo."). */
  readonly note?: string | undefined;
}

/** Horarios de clases de la escuela. */
export interface ClassSchedule {
  readonly blocks: readonly ScheduleBlock[];
}

const TIME = /^([01]\d|2[0-3]):[0-5]\d$/u;

function minutes(time: string): number {
  const [hours = 0, mins = 0] = time.split(':').map(Number);
  return hours * 60 + mins;
}

function validateBlock(issues: Issues, block: ScheduleBlock): void {
  issues.check(block.days.length > 0, `${block.id}: necesita al menos un día.`);
  issues.check(findDuplicates(block.days).length === 0, `${block.id}: días repetidos.`);
  const ordered = block.days.every(
    (day, index) =>
      index === 0 || WEEKDAYS.indexOf(day) > WEEKDAYS.indexOf(block.days[index - 1] ?? day),
  );
  issues.check(ordered, `${block.id}: los días deben ir en orden de la semana.`);
  if (block.kind === 'practice') {
    issues.check(
      block.slots.length > 0 || (block.note !== undefined && isNonEmpty(block.note)),
      `${block.id}: sin franjas fijas, necesita una nota que explique cómo coordinarlas.`,
    );
  } else {
    issues.check(block.slots.length > 0, `${block.id}: necesita al menos una franja.`);
  }
  let previousEnd = -1;
  for (const slot of block.slots) {
    const valid = TIME.test(slot.start) && TIME.test(slot.end);
    issues.check(valid, `${block.id}: hora no válida en ${slot.start}–${slot.end} (usa HH:MM).`);
    if (!valid) continue;
    issues.check(
      minutes(slot.start) < minutes(slot.end),
      `${block.id}: ${slot.start} debe ser antes de ${slot.end}.`,
    );
    issues.check(
      minutes(slot.start) >= previousEnd,
      `${block.id}: las franjas se cruzan o no van en orden.`,
    );
    previousEnd = minutes(slot.end);
  }
}

/** @throws {InvalidContentError} Si algún bloque tiene días u horas no válidos. */
export function createClassSchedule(props: ClassSchedule): ClassSchedule {
  const issues = new Issues('ClassSchedule');
  issues.check(props.blocks.length > 0, 'Debe haber al menos un bloque de clases.');
  const duplicated = findDuplicates(props.blocks.map((block) => block.id));
  issues.check(duplicated.length === 0, `Bloques repetidos: ${duplicated.join(', ')}.`);
  for (const block of props.blocks) validateBlock(issues, block);
  issues.throwIfAny();
  return deepFreeze({ ...props });
}

/** Busca un bloque por su identificador. */
export function findBlock(schedule: ClassSchedule, id: ScheduleBlockId): ScheduleBlock | undefined {
  return schedule.blocks.find((block) => block.id === id);
}
