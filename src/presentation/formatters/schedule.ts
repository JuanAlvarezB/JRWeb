import {
  WEEKDAYS,
  type ScheduleBlock,
  type TimeRange,
  type Weekday,
} from '@/domain/entities/ClassSchedule';
import { countInWords, joinList, NBSP } from './text';

/** Nombres de los días: completos ("lunes") o abreviados ("lun"). */
export type DayStyle = 'long' | 'short';

const DAY_NAMES: Record<DayStyle, Record<Weekday, string>> = {
  long: {
    monday: 'lunes',
    tuesday: 'martes',
    wednesday: 'miércoles',
    thursday: 'jueves',
    friday: 'viernes',
    saturday: 'sábado',
    sunday: 'domingo',
  },
  short: {
    monday: 'lun',
    tuesday: 'mar',
    wednesday: 'mié',
    thursday: 'jue',
    friday: 'vie',
    saturday: 'sáb',
    sunday: 'dom',
  },
};

/** Desde cuántos días seguidos se escribe como rango ("lunes a viernes"). */
const MIN_DAYS_FOR_RANGE = 4;
const NOON = 12;
const MINUTES_PER_HOUR = 60;

type Meridiem = 'am' | 'noon' | 'pm';

const MERIDIEM_TEXT: Record<Meridiem, string> = {
  am: `a.${NBSP}m.`,
  noon: 'm.',
  pm: `p.${NBSP}m.`,
};

/**
 * Días de un bloque: rango si son 4 o más seguidos ("lunes a viernes"); si no,
 * lista ("lun, mar y mié").
 */
export function formatDays(days: readonly Weekday[], style: DayStyle = 'long'): string {
  const names = DAY_NAMES[style];
  const ordered = WEEKDAYS.filter((day) => days.includes(day));
  const first = ordered[0];
  const last = ordered.at(-1);
  const consecutive =
    first !== undefined &&
    last !== undefined &&
    WEEKDAYS.indexOf(last) - WEEKDAYS.indexOf(first) === ordered.length - 1;
  if (consecutive && ordered.length >= MIN_DAYS_FOR_RANGE) {
    return `${names[first]} a ${names[last]}`;
  }
  return joinList(ordered.map((day) => names[day]));
}

interface ClockTime {
  readonly hour12: number;
  readonly minutes: number;
  readonly meridiem: Meridiem;
}

function toClock(time: string): ClockTime {
  const [hours = 0, minutes = 0] = time.split(':').map(Number);
  const totalMinutes = hours * MINUTES_PER_HOUR + minutes;
  const meridiem: Meridiem =
    totalMinutes === NOON * MINUTES_PER_HOUR ? 'noon' : hours < NOON ? 'am' : 'pm';
  return { hour12: hours % NOON === 0 ? NOON : hours % NOON, minutes, meridiem };
}

function clockText({ hour12, minutes }: ClockTime, compact: boolean): string {
  return compact && minutes === 0
    ? String(hour12)
    : `${String(hour12)}:${String(minutes).padStart(2, '0')}`;
}

export interface TimeRangeFormat {
  /** Sin ":00" en horas en punto ("8–10 a. m."), para el footer. */
  readonly compact?: boolean;
  /** Separador: guion "–" (por defecto) o " a " en frases ("de 6:00 a 8:00 p. m."). */
  readonly separator?: string;
}

/**
 * Franja en formato colombiano de 12 horas. El meridiano se escribe una vez si es el
 * mismo ("8:00–10:00 a. m.") y en ambos extremos si cambia ("10:00 a. m.–12:00 m.").
 */
export function formatTimeRange(
  range: TimeRange,
  { compact = false, separator = '–' }: TimeRangeFormat = {},
): string {
  const start = toClock(range.start);
  const end = toClock(range.end);
  const endText = `${clockText(end, compact)}${NBSP}${MERIDIEM_TEXT[end.meridiem]}`;
  const startText =
    start.meridiem === end.meridiem
      ? clockText(start, compact)
      : `${clockText(start, compact)}${NBSP}${MERIDIEM_TEXT[start.meridiem]}`;
  return `${startText}${separator}${endText}`;
}

/** Todas las franjas de un bloque en una frase ("8:00–10:00 a. m., … y 4:00–6:00 p. m."). */
export function formatSlots(block: ScheduleBlock, format: TimeRangeFormat = {}): string {
  return joinList(block.slots.map((slot) => formatTimeRange(slot, format)));
}

/**
 * Resumen corto de las franjas: "cuatro franjas" si son varias, la franja si es una
 * ("6:00–8:00 p. m.") y vacío si no tiene (prácticas).
 */
export function summarizeSlots(block: ScheduleBlock, format: TimeRangeFormat = {}): string {
  const [only] = block.slots;
  if (block.slots.length > 1) return `${countInWords(block.slots.length)} franjas`;
  return only === undefined ? '' : formatTimeRange(only, format);
}
