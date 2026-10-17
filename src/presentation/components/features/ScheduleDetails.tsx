import type { JSX } from 'react';
import { findBlock, type ClassSchedule } from '@/domain/entities/ClassSchedule';
import {
  formatDays,
  formatSlots,
  formatTimeRange,
  summarizeSlots,
} from '@/presentation/formatters/schedule';
import { withPeriod } from '@/presentation/formatters/text';
import { UI_TEXT } from '@/shared/constants/uiText';
import { cx } from '@/shared/utils/cx';
import styles from './ScheduleDetails.module.css';

/**
 * - `detailed`: cada franja (Nosotros, tarjeta "Horarios flexibles").
 * - `summary`: una frase por tipo de clase (bloque de ubicación).
 */
export type ScheduleDetailsVariant = 'detailed' | 'summary';

interface ScheduleLine {
  readonly label: string;
  readonly text: string;
}

const { schedule: TEXT } = UI_TEXT;

function detailedLines(schedule: ClassSchedule): ScheduleLine[] {
  const day = findBlock(schedule, 'theory-day');
  const night = findBlock(schedule, 'theory-night');
  const practice = findBlock(schedule, 'practice');
  return [
    day && { label: TEXT.theoryDayLabel(formatDays(day.days)), text: withPeriod(formatSlots(day)) },
    night && {
      label: TEXT.theoryNightLabel,
      text: withPeriod(`${formatDays(night.days)}, ${formatSlots(night)}`),
    },
    practice && { label: TEXT.practiceLabel, text: withPeriod(formatDays(practice.days)) },
  ].filter((line) => line !== undefined);
}

function summaryLines(schedule: ClassSchedule): ScheduleLine[] {
  const day = findBlock(schedule, 'theory-day');
  const night = findBlock(schedule, 'theory-night');
  const [nightSlot] = night?.slots ?? [];
  const practice = findBlock(schedule, 'practice');
  return [
    day &&
      night &&
      nightSlot && {
        label: `${TEXT.theory}:`,
        text: withPeriod(
          TEXT.theorySummary(
            formatDays(day.days),
            summarizeSlots(day),
            formatDays(night.days, 'short'),
            formatTimeRange(nightSlot, { separator: ' a ' }),
          ),
        ),
      },
    practice && { label: `${TEXT.practice}:`, text: withPeriod(formatDays(practice.days)) },
  ].filter((line) => line !== undefined);
}

interface ScheduleDetailsProps {
  readonly schedule: ClassSchedule;
  readonly variant?: ScheduleDetailsVariant;
  readonly className?: string | undefined;
}

/** Horarios en frases con su etiqueta en negrita ("Prácticas: lunes a sábado."). */
export function ScheduleDetails({
  schedule,
  variant = 'detailed',
  className,
}: ScheduleDetailsProps): JSX.Element {
  const lines = variant === 'detailed' ? detailedLines(schedule) : summaryLines(schedule);
  return (
    <div className={cx(styles.details, className)}>
      {lines.map((line) => (
        <p key={line.label}>
          <strong className={styles.label}>{line.label}</strong> {line.text}
        </p>
      ))}
    </div>
  );
}
