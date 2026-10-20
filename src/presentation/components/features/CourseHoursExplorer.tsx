import { useRef, useState, type JSX } from 'react';
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

/** Teclas del grupo de radios (patrón WAI-ARIA): flechas, Inicio y Fin, con vuelta. */
const KEY_STEPS: Readonly<Record<string, number | 'first' | 'last'>> = {
  ArrowRight: 1,
  ArrowDown: 1,
  ArrowLeft: -1,
  ArrowUp: -1,
  Home: 'first',
  End: 'last',
};

/** Categoría a la que lleva una tecla, o `undefined` si la tecla no mueve la selección. */
export function nextCategory(
  categories: readonly LicenseCategory[],
  current: LicenseCategory,
  key: string,
): LicenseCategory | undefined {
  const step = KEY_STEPS[key];
  if (step === undefined || categories.length === 0) return undefined;
  if (step === 'first') return categories[0];
  if (step === 'last') return categories.at(-1);
  const index = categories.indexOf(current);
  return categories[(index + step + categories.length) % categories.length];
}

/**
 * "Tu curso en horas" (Inicio): selector de categoría y arco del velocímetro con la
 * distribución real de horas. Cambiar de categoría no hace consultas nuevas.
 */
export function CourseHoursExplorer(): JSX.Element | null {
  const plans = usePlans();
  const services = useServices();
  const whatsAppLink = useWhatsAppLinkBuilder();
  const [category, setCategory] = useState<LicenseCategory>(DEFAULT_CATEGORY);
  const chipRefs = useRef(new Map<LicenseCategory, HTMLButtonElement>());

  const plan = plans.find((item) => item.category === category) ?? plans[0];
  if (plan === undefined) return null;
  const service = services.find((item) => item.category === plan.category);
  const categories = plans.map((item) => item.category);
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
        <div
          role="radiogroup"
          aria-label={UI_TEXT.courseHours.selectorLabel}
          className={styles.chips}
        >
          {plans.map((item) => {
            const checked = item.category === plan.category;
            return (
              <button
                key={item.category}
                ref={(node) => {
                  if (node === null) chipRefs.current.delete(item.category);
                  else chipRefs.current.set(item.category, node);
                }}
                type="button"
                role="radio"
                aria-checked={checked}
                tabIndex={checked ? 0 : -1}
                className={cx(styles.chip, checked && styles.chipSelected)}
                onClick={() => {
                  setCategory(item.category);
                }}
                onKeyDown={(event) => {
                  const next = nextCategory(categories, plan.category, event.key);
                  if (next === undefined) return;
                  event.preventDefault();
                  setCategory(next);
                  chipRefs.current.get(next)?.focus();
                }}
              >
                {item.category}
              </button>
            );
          })}
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
