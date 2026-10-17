import type { JSX } from 'react';
import { useCompanyInfo } from '@/presentation/hooks/useCompanyInfo';
import { useSchedule } from '@/presentation/hooks/useSchedule';
import { cx } from '@/shared/utils/cx';
import { BenefitCard } from './BenefitCard';
import styles from './BenefitGrid.module.css';
import { differentiatorIcon, SCHEDULE_DIFFERENTIATOR_ID } from './differentiatorIcons';
import { ScheduleDetails } from './ScheduleDetails';

/**
 * "Lo que nos diferencia" (Nosotros): la tarjeta de horarios muestra el horario real
 * completo en lugar de la descripción corta del Inicio.
 */
export function DifferentiatorCards(): JSX.Element {
  const { differentiators } = useCompanyInfo();
  const schedule = useSchedule();

  return (
    <ul className={cx(styles.grid, styles.twoColumns)}>
      {differentiators.map((item) => (
        <BenefitCard key={item.id} icon={differentiatorIcon(item.id)} title={item.title}>
          {item.id === SCHEDULE_DIFFERENTIATOR_ID ? (
            <ScheduleDetails schedule={schedule} />
          ) : (
            <p>{item.description}</p>
          )}
        </BenefitCard>
      ))}
    </ul>
  );
}
