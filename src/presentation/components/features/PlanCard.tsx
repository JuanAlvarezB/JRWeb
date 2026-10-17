import type { JSX } from 'react';
import { totalHours } from '@/domain/entities/CourseHours';
import type { Plan } from '@/domain/entities/Plan';
import { ActionLink } from '@/presentation/components/ui/ActionLink';
import { Button } from '@/presentation/components/ui/Button';
import { Card } from '@/presentation/components/ui/Card';
import { Icon } from '@/presentation/components/ui/Icon';
import { UI_TEXT } from '@/shared/constants/uiText';
import styles from './PlanCard.module.css';

/**
 * - `summary`: total del curso (Inicio).
 * - `detailed`: "Incluye" con las horas de teoría, taller y manejo, y el total (Planes).
 */
export type PlanCardVariant = 'summary' | 'detailed';

interface PlanCardProps {
  readonly plan: Plan;
  readonly variant: PlanCardVariant;
  /** WhatsApp con "quiero conocer el precio" del plan. */
  readonly priceHref: string;
  /** WhatsApp con "quiero conocer los requisitos" del plan. */
  readonly requirementsHref: string;
}

const { plans: TEXT, hours: HOURS } = UI_TEXT;

function CheckRow({
  label,
  value,
}: {
  readonly label: string;
  readonly value: string;
}): JSX.Element {
  return (
    <li className={styles.row}>
      <Icon name="check" weight="bold" className={styles.check} />
      <span className={styles.rowLabel}>{label}</span>
      <span className={styles.rowValue}>{value}</span>
    </li>
  );
}

/**
 * Tarjeta de plan (DESIGN.md §5): **sin precio**. Las tres tienen el mismo peso
 * visual; "Consultar precio" abre WhatsApp con el plan.
 */
export function PlanCard({
  plan,
  variant,
  priceHref,
  requirementsHref,
}: PlanCardProps): JSX.Element {
  const total = totalHours(plan.hours);
  const serviceType = UI_TEXT.serviceType[plan.serviceType];

  return (
    <Card as="li" padding="md" className={styles.card}>
      <p className={styles.eyebrow}>{TEXT.eyebrow(plan.ageRequirement, serviceType)}</p>
      <h3 className={styles.name}>{plan.name}</h3>
      <p className={styles.description}>{plan.description}</p>

      {variant === 'detailed' && (
        <div className={styles.includes}>
          <p className={styles.includesLabel}>{TEXT.includes}</p>
          <ul className={styles.rows}>
            <CheckRow label={TEXT.theoryClasses} value={HOURS.short(plan.hours.theory)} />
            <CheckRow label={TEXT.workshopPractice} value={HOURS.short(plan.hours.workshop)} />
            <CheckRow label={TEXT.drivingPractice} value={HOURS.short(plan.hours.driving)} />
          </ul>
          <p className={styles.total}>
            <span>{TEXT.total}</span>
            <span>{HOURS.count(total)}</span>
          </p>
        </div>
      )}

      <div className={styles.footer}>
        {variant === 'summary' && (
          <ul className={styles.rows}>
            <CheckRow label={TEXT.completeCourse} value={HOURS.count(total)} />
          </ul>
        )}
        <Button href={priceHref} newTab icon="whatsapp" className={styles.priceButton}>
          {TEXT.askPrice}
        </Button>
        <ActionLink href={requirementsHref} newTab className={styles.requirements}>
          {TEXT.askRequirements}
        </ActionLink>
      </div>
    </Card>
  );
}
