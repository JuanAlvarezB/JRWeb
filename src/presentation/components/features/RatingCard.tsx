import type { JSX } from 'react';
import type { RatingSummary } from '@/domain/entities/Testimonial';
import { ActionLink } from '@/presentation/components/ui/ActionLink';
import { Card } from '@/presentation/components/ui/Card';
import { Icon } from '@/presentation/components/ui/Icon';
import { formatMonthYear, formatRating } from '@/presentation/formatters/text';
import { UI_TEXT } from '@/shared/constants/uiText';
import { cx } from '@/shared/utils/cx';
import styles from './RatingCard.module.css';

const MAX_STARS = 5;
const STARS = Array.from({ length: MAX_STARS }, (_, index) => index + 1);
const { testimonials: TEXT } = UI_TEXT;

interface RatingCardProps {
  readonly rating: RatingSummary;
}

/**
 * Calificación de Google (DESIGN.md §5): número grande, estrellas en Tinta (el verde
 * queda para acciones), cantidad de opiniones con la fecha del dato y link a Google.
 */
export function RatingCard({ rating }: RatingCardProps): JSX.Element {
  const score = formatRating(rating.score);
  const filled = Math.round(rating.score);

  return (
    <Card as="li" padding="md" className={styles.card}>
      <p className={styles.label}>{TEXT.ratingLabel}</p>
      <p className={styles.score}>
        <span className={styles.value}>{score}</span>
        <span className={styles.outOf}>{TEXT.outOf(MAX_STARS)}</span>
      </p>
      <p className={styles.stars} role="img" aria-label={TEXT.starsLabel(score)}>
        {STARS.map((star) => (
          <Icon
            key={star}
            name="star"
            className={cx(styles.star, star <= filled && styles.filled)}
          />
        ))}
      </p>
      <p className={styles.footnote}>
        {TEXT.ratingFootnote(rating.reviewCount, formatMonthYear(rating.asOf))}
      </p>
      <ActionLink href={rating.reviewsUrl} newTab className={styles.link}>
        {TEXT.seeReviews}
      </ActionLink>
    </Card>
  );
}
