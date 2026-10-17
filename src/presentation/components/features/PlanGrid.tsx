import type { JSX } from 'react';
import { usePlans } from '@/presentation/hooks/usePlans';
import { useWhatsAppLinkBuilder } from '@/presentation/hooks/useWhatsAppLink';
import { PlanCard, type PlanCardVariant } from './PlanCard';
import styles from './PlanGrid.module.css';

interface PlanGridProps {
  readonly variant: PlanCardVariant;
}

/** Grilla de planes (Inicio y Planes) con sus enlaces de WhatsApp por categoría. */
export function PlanGrid({ variant }: PlanGridProps): JSX.Element {
  const plans = usePlans();
  const whatsAppLink = useWhatsAppLinkBuilder();

  return (
    <ul className={styles.grid}>
      {plans.map((plan) => (
        <PlanCard
          key={plan.category}
          plan={plan}
          variant={variant}
          priceHref={whatsAppLink({ topic: 'price', category: plan.category })}
          requirementsHref={whatsAppLink({ topic: 'requirements', category: plan.category })}
        />
      ))}
    </ul>
  );
}
