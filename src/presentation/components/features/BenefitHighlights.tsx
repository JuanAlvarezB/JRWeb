import type { JSX } from 'react';
import { formatMonthYear, formatRating } from '@/presentation/formatters/text';
import { useCompanyInfo } from '@/presentation/hooks/useCompanyInfo';
import { useTestimonials } from '@/presentation/hooks/useTestimonials';
import { ROUTES, SECTION_IDS, withSection } from '@/shared/constants/routes';
import { UI_TEXT } from '@/shared/constants/uiText';
import { cx } from '@/shared/utils/cx';
import { BenefitCard } from './BenefitCard';
import styles from './BenefitGrid.module.css';
import { differentiatorIcon, SCHEDULE_DIFFERENTIATOR_ID } from './differentiatorIcons';

/**
 * "Por qué J&R" (Inicio): los diferenciadores de la escuela y la calificación real de
 * Google. Si no hay calificación publicada, se muestran solo los diferenciadores.
 */
export function BenefitHighlights(): JSX.Element {
  const { differentiators } = useCompanyInfo();
  const { rating } = useTestimonials();
  const score = formatRating(rating.score);
  const showRating = rating.reviewCount > 0;

  return (
    <ul className={cx(styles.grid, styles.threeColumns)}>
      {differentiators.map((item) => (
        <BenefitCard
          key={item.id}
          icon={differentiatorIcon(item.id)}
          title={item.title}
          action={
            item.id === SCHEDULE_DIFFERENTIATOR_ID
              ? {
                  label: UI_TEXT.benefits.seeSchedules,
                  to: withSection(ROUTES.contact, SECTION_IDS.schedules),
                }
              : undefined
          }
        >
          <p>{item.description}</p>
        </BenefitCard>
      ))}
      {showRating && (
        <BenefitCard
          icon="star"
          title={UI_TEXT.benefits.ratingTitle(score)}
          action={{ label: UI_TEXT.benefits.seeReviews, href: rating.reviewsUrl, newTab: true }}
        >
          <p>
            {UI_TEXT.benefits.ratingText(score, rating.reviewCount, formatMonthYear(rating.asOf))}
          </p>
        </BenefitCard>
      )}
    </ul>
  );
}
