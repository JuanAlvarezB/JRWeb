import { useState, type JSX } from 'react';
import { totalHours, type CourseHours } from '@/domain/entities/CourseHours';
import type { LicenseCategory } from '@/domain/entities/LicenseCategory';
import { SpeedometerArc } from '@/presentation/components/brand/SpeedometerArc';
import { ActionLink } from '@/presentation/components/ui/ActionLink';
import { Card } from '@/presentation/components/ui/Card';
import { usePlans } from '@/presentation/hooks/usePlans';
import { useServices } from '@/presentation/hooks/useServices';
import { useWhatsAppLinkBuilder } from '@/presentation/hooks/useWhatsAppLink';
import { UI_TEXT } from '@/shared/constants/uiText';
import { cx } from '@/shared/utils/cx';
import styles from './CourseHoursExplorer.module.css';
import { hoursSegments } from './hoursSegments';

/** Categoría que se muestra al cargar (la más consultada, como en los mockups). */
const DEFAULT_CATEGORY: LicenseCategory = 'B1';

const { hours: HOURS } = UI_TEXT;

const LEGEND: readonly { readonly key: keyof CourseHours; readonly label: string }[] = [
  { key: 'theory', label: HOURS.theory },
  { key: 'workshop', label: HOURS.workshop },
  { key: 'driving', label: HOURS.driving },
];

/**
 * "Tu curso en horas" (Inicio): selector de categoría y arco del velocímetro con la
 * distribución real de horas. Cambiar de categoría no hace consultas nuevas.
 */
export function CourseHoursExplorer(): JSX.Element | null {
  const plans = usePlans();
  const services = useServices();
  const whatsAppLink = useWhatsAppLinkBuilder();
  const [category, setCategory] = useState<LicenseCategory>(DEFAULT_CATEGORY);

  const plan = plans.find((item) => item.category === category) ?? plans[0];
  if (plan === undefined) return null;
  const service = services.find((item) => item.category === plan.category);
  const total = totalHours(plan.hours);
  const { theory, workshop, driving } = plan.hours;

  return (
    <Card padding="lg" hoverable={false} className={styles.card}>
      <div className={styles.arcColumn}>
        <SpeedometerArc
          segments={hoursSegments(plan.hours)}
          centerValue={String(total)}
          caption={UI_TEXT.speedometer.totalCaption}
          needle="end"
          label={HOURS.arcLabel(plan.name, total, theory, workshop, driving)}
          className={styles.arc}
        />
      </div>

      <div className={styles.details}>
        <div role="group" aria-label={UI_TEXT.courseHours.selectorLabel} className={styles.chips}>
          {plans.map((item) => (
            <button
              key={item.category}
              type="button"
              aria-pressed={item.category === plan.category}
              className={cx(styles.chip, item.category === plan.category && styles.chipSelected)}
              onClick={() => {
                setCategory(item.category);
              }}
            >
              {item.category}
            </button>
          ))}
        </div>

        <div aria-live="polite">
          <h3 className={styles.name}>{plan.name}</h3>
          <p className={styles.description}>
            {plan.description}
            {service !== undefined && ` ${service.ageRequirement}.`}
          </p>
          <ul className={styles.legend}>
            {LEGEND.map(({ key, label }) => (
              <li key={key} className={styles.legendRow}>
                <span className={cx(styles.swatch, styles[key])} aria-hidden="true" />
                <span className={styles.legendLabel}>{label}</span>
                <span className={styles.legendValue}>{HOURS.count(plan.hours[key])}</span>
              </li>
            ))}
          </ul>
        </div>

        <ActionLink
          href={whatsAppLink({ topic: 'requirements', category: plan.category })}
          newTab
          className={styles.link}
        >
          {UI_TEXT.courseHours.requirementsLink}
        </ActionLink>
      </div>
    </Card>
  );
}
