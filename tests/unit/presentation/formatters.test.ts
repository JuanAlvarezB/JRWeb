import { describe, expect, it } from 'vitest';
import type { ScheduleBlock } from '@/domain/entities/ClassSchedule';
import {
  formatDays,
  formatSlots,
  formatTimeRange,
  summarizeSlots,
} from '@/presentation/formatters/schedule';
import {
  capitalizeFirst,
  countInWords,
  formatMonthYear,
  formatRating,
  joinList,
  NBSP,
  withPeriod,
} from '@/presentation/formatters/text';

/** Cambia los espacios de no separación por espacios normales para leer las pruebas. */
const plain = (text: string): string => text.replaceAll(NBSP, ' ');

const dayBlock: ScheduleBlock = {
  id: 'theory-day',
  kind: 'theory',
  days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
  slots: [
    { start: '08:00', end: '10:00' },
    { start: '10:00', end: '12:00' },
    { start: '14:00', end: '16:00' },
    { start: '16:00', end: '18:00' },
  ],
};

describe('formatTimeRange (formato colombiano de 12 horas)', () => {
  it('escribe el meridiano una vez si no cambia', () => {
    expect(plain(formatTimeRange({ start: '08:00', end: '10:00' }))).toBe('8:00–10:00 a. m.');
    expect(plain(formatTimeRange({ start: '18:00', end: '20:00' }))).toBe('6:00–8:00 p. m.');
  });

  it('el mediodía es "m." y el meridiano va en ambos extremos si cambia', () => {
    expect(plain(formatTimeRange({ start: '10:00', end: '12:00' }))).toBe('10:00 a. m.–12:00 m.');
    expect(plain(formatTimeRange({ start: '11:30', end: '13:00' }))).toBe('11:30 a. m.–1:00 p. m.');
  });

  it('compacto (footer) y con separador de frase', () => {
    expect(plain(formatTimeRange({ start: '14:00', end: '16:00' }, { compact: true }))).toBe(
      '2–4 p. m.',
    );
    expect(plain(formatTimeRange({ start: '18:00', end: '20:00' }, { separator: ' a ' }))).toBe(
      '6:00 a 8:00 p. m.',
    );
  });

  it('nunca parte "a. m." en dos líneas', () => {
    expect(formatTimeRange({ start: '08:00', end: '10:00' })).toContain(`a.${NBSP}m.`);
    expect(formatTimeRange({ start: '08:00', end: '10:00' })).not.toContain(' ');
  });
});

describe('formatDays', () => {
  it('cuatro o más días seguidos van como rango', () => {
    expect(formatDays(dayBlock.days)).toBe('lunes a viernes');
    expect(formatDays(['saturday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday'])).toBe(
      'lunes a sábado',
    );
  });

  it('pocos días o días sueltos van como lista, completos o abreviados', () => {
    expect(formatDays(['monday', 'tuesday', 'wednesday'])).toBe('lunes, martes y miércoles');
    expect(formatDays(['wednesday', 'monday', 'tuesday'], 'short')).toBe('lun, mar y mié');
    expect(formatDays(['monday', 'wednesday', 'friday', 'saturday'])).toBe(
      'lunes, miércoles, viernes y sábado',
    );
  });
});

describe('franjas de un bloque', () => {
  it('formatSlots las une todas', () => {
    expect(plain(formatSlots(dayBlock))).toBe(
      '8:00–10:00 a. m., 10:00 a. m.–12:00 m., 2:00–4:00 p. m. y 4:00–6:00 p. m.',
    );
  });

  it('summarizeSlots: "cuatro franjas", la franja si es una, o nada', () => {
    expect(summarizeSlots(dayBlock)).toBe('cuatro franjas');
    expect(plain(summarizeSlots({ ...dayBlock, slots: [{ start: '18:00', end: '20:00' }] }))).toBe(
      '6:00–8:00 p. m.',
    );
    expect(summarizeSlots({ ...dayBlock, slots: [] })).toBe('');
  });
});

describe('formatos de texto', () => {
  it('withPeriod no duplica el punto', () => {
    expect(withPeriod('lunes a sábado')).toBe('lunes a sábado.');
    expect(plain(withPeriod(`6:00–8:00 p.${NBSP}m.`))).toBe('6:00–8:00 p. m.');
  });

  it('listas, mayúscula inicial y números en palabras', () => {
    expect(joinList([])).toBe('');
    expect(joinList(['a'])).toBe('a');
    expect(joinList(['a', 'b', 'c'])).toBe('a, b y c');
    expect(capitalizeFirst('lunes a viernes')).toBe('Lunes a viernes');
    expect(countInWords(4)).toBe('cuatro');
    expect(countInWords(12)).toBe('12');
  });

  it('mes y año sin desfase de zona horaria, y calificación con un decimal', () => {
    expect(formatMonthYear('2026-10-14')).toBe('octubre de 2026');
    expect(formatMonthYear('2027-01-01')).toBe('enero de 2027');
    expect(formatRating(5)).toBe('5.0');
    expect(formatRating(4.75)).toBe('4.8');
  });
});
