import type { JSX } from 'react';
import type { ScheduleBlockId } from '@/domain/entities/ClassSchedule';
import { Card } from '@/presentation/components/ui/Card';
import { formatDays, formatTimeRange } from '@/presentation/formatters/schedule';
import { capitalizeFirst } from '@/presentation/formatters/text';
import { useSchedule } from '@/presentation/hooks/useSchedule';
import { UI_TEXT } from '@/shared/constants/uiText';
import styles from './ScheduleCards.module.css';

const EYEBROWS: Record<ScheduleBlockId, string> = {
  'theory-day': UI_TEXT.schedule.dayEyebrow,
  'theory-night': UI_TEXT.schedule.nightEyebrow,
  practice: UI_TEXT.schedule.practiceEyebrow,
};

/** Horarios de clases (Contáctanos): una tarjeta por jornada con sus franjas o su nota. */
export function ScheduleCards(): JSX.Element {
  const { blocks } = useSchedule();
  return (
    <ul className={styles.grid}>
      {blocks.map((block) => (
        <Card key={block.id} as="li" padding="sm" className={styles.card}>
          <p className={styles.eyebrow}>{EYEBROWS[block.id]}</p>
          <h3 className={styles.days}>{capitalizeFirst(formatDays(block.days))}</h3>
          {block.slots.length > 0 && (
            <ul className={styles.slots}>
              {block.slots.map((slot) => (
                <li key={slot.start}>{formatTimeRange(slot)}</li>
              ))}
            </ul>
          )}
          {block.note !== undefined && <p className={styles.note}>{block.note}</p>}
        </Card>
      ))}
    </ul>
  );
}
