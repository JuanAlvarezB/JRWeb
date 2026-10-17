import type { JSX, ReactNode } from 'react';
import { ActionLink } from '@/presentation/components/ui/ActionLink';
import { Card } from '@/presentation/components/ui/Card';
import { Icon } from '@/presentation/components/ui/Icon';
import type { IconName } from '@/presentation/components/ui/iconRegistry';
import type { PressableTarget } from '@/presentation/components/ui/Pressable';
import styles from './BenefitCard.module.css';

/** Link de acción opcional al pie de la tarjeta. */
export type BenefitAction = { readonly label: string } & PressableTarget;

interface BenefitCardProps {
  readonly icon: IconName;
  readonly title: string;
  /** Texto en Piedra; puede ser un párrafo o una lista (horarios en Nosotros). */
  readonly children: ReactNode;
  readonly action?: BenefitAction | undefined;
}

/**
 * Tarjeta de beneficio (DESIGN.md §5): ícono de línea en un círculo Brillo Lima,
 * título de 22 px, texto en Piedra y link de acción opcional.
 */
export function BenefitCard({ icon, title, children, action }: BenefitCardProps): JSX.Element {
  return (
    <Card as="li" padding="lg" className={styles.card}>
      <span className={styles.iconCircle}>
        <Icon name={icon} className={styles.icon} />
      </span>
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.body}>{children}</div>
      {action !== undefined && (
        <ActionLink {...action} className={styles.action}>
          {action.label}
        </ActionLink>
      )}
    </Card>
  );
}
