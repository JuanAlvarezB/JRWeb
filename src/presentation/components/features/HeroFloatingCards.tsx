import type { JSX, ReactNode } from 'react';
import { findBlock } from '@/domain/entities/ClassSchedule';
import { totalHours } from '@/domain/entities/CourseHours';
import type { LicenseCategory } from '@/domain/entities/LicenseCategory';
import { HeroWash } from '@/presentation/components/brand/HeroWash';
import { SpeedometerArc } from '@/presentation/components/brand/SpeedometerArc';
import { Icon } from '@/presentation/components/ui/Icon';
import { formatDays, formatTimeRange, summarizeSlots } from '@/presentation/formatters/schedule';
import { withPeriod } from '@/presentation/formatters/text';
import { usePlans } from '@/presentation/hooks/usePlans';
import { useSchedule } from '@/presentation/hooks/useSchedule';
import { useSchoolLocation } from '@/presentation/hooks/useSchoolLocation';
import { useServices } from '@/presentation/hooks/useServices';
import { UI_TEXT } from '@/shared/constants/uiText';
import { cx } from '@/shared/utils/cx';
import styles from './HeroFloatingCards.module.css';
import { hoursSegments } from './hoursSegments';
import { MapIllustration } from './MapIllustration';

/** Curso que muestran las tarjetas (el más consultado, como en los mockups). */
const FEATURED_CATEGORY: LicenseCategory = 'B1';

const { heroCards: TEXT, hours: HOURS } = UI_TEXT;

interface HeroFloatingCardsProps {
  /** Contenido central del hero: franja, titular, subtítulo y botones. */
  readonly children: ReactNode;
}

/**
 * Hero con tarjetas flotantes (DESIGN.md §5, "la interfaz es el hero"): datos reales
 * del curso B1, los horarios y la ubicación sobre la aguada verde, rotadas ±2°. En
 * escritorio rodean el titular; en móvil se apilan debajo (máximo 2).
 */
export function HeroFloatingCards({ children }: HeroFloatingCardsProps): JSX.Element {
  const plans = usePlans();
  const services = useServices();
  const schedule = useSchedule();
  const location = useSchoolLocation();

  const plan = plans.find((item) => item.category === FEATURED_CATEGORY) ?? plans[0];
  const service = services.find((item) => item.category === plan?.category);
  const day = findBlock(schedule, 'theory-day');
  const night = findBlock(schedule, 'theory-night');
  const [nightSlot] = night?.slots ?? [];

  const hours = plan === undefined ? undefined : plan.hours;
  const total = hours === undefined ? 0 : totalHours(hours);
  const breakdown =
    hours === undefined ? '' : HOURS.breakdown(hours.theory, hours.workshop, hours.driving);
  const arcLabel =
    plan === undefined || hours === undefined
      ? ''
      : HOURS.arcLabel(plan.name, total, hours.theory, hours.workshop, hours.driving);
  const serviceType = plan === undefined ? '' : UI_TEXT.serviceType[plan.serviceType];

  return (
    <div className={styles.hero}>
      <HeroWash className={styles.wash} />
      <div className={styles.content}>{children}</div>

      <ul className={styles.cards} aria-label={TEXT.region}>
        {/* Orden de lectura y de la pila móvil: horas, clases teóricas, plan y ubicación. */}
        {plan !== undefined && hours !== undefined && (
          <li className={cx(styles.card, styles.hours)}>
            <p className={cx(styles.eyebrow, styles.desktopOnly)}>
              {TEXT.hoursEyebrow(plan.category, total)}
            </p>
            <SpeedometerArc
              segments={hoursSegments(hours)}
              centerValue={String(total)}
              needle="end"
              sweep
              label={arcLabel}
              className={styles.arc}
            />
            <div className={styles.hoursText}>
              <p className={cx(styles.eyebrow, styles.mobileOnly)}>
                {TEXT.hoursMobileEyebrow(plan.name, serviceType)}
              </p>
              <p className={cx(styles.title, styles.mobileOnly)}>{HOURS.count(total)}</p>
              <p className={styles.breakdown}>{breakdown}</p>
            </div>
          </li>
        )}
        {day !== undefined && night !== undefined && nightSlot !== undefined && (
          <li className={cx(styles.card, styles.theory)}>
            <span className={styles.iconCircle}>
              <Icon name="clock" className={styles.icon} />
            </span>
            <div>
              <p className={styles.cardHeading}>{TEXT.theoryTitle}</p>
              <p className={styles.text}>
                {TEXT.dayShift}: {withPeriod(`${formatDays(day.days)}, ${summarizeSlots(day)}`)}
              </p>
              <p className={styles.text}>
                {TEXT.nightShift}:{' '}
                {withPeriod(`${formatDays(night.days, 'short')}, ${formatTimeRange(nightSlot)}`)}
              </p>
            </div>
          </li>
        )}

        {plan !== undefined && service !== undefined && (
          <li className={cx(styles.card, styles.plan, styles.desktopOnly)}>
            <p className={styles.eyebrow}>{TEXT.planEyebrow(plan.name, serviceType)}</p>
            <p className={styles.title}>{service.ageRequirement}</p>
            <p className={styles.text}>{service.vehicles}</p>
          </li>
        )}

        <li className={cx(styles.card, styles.location, styles.desktopOnly)}>
          <div className={styles.miniMap}>
            <MapIllustration />
          </div>
          <p className={styles.eyebrow}>{TEXT.locationEyebrow(location.address.city)}</p>
          <p className={styles.street}>{location.address.street}</p>
        </li>
      </ul>
    </div>
  );
}
