import type { JSX } from 'react';
import type { Statement } from '@/domain/entities/CompanyInfo';
import { Card } from '@/presentation/components/ui/Card';
import { useCompanyInfo } from '@/presentation/hooks/useCompanyInfo';
import { UI_TEXT } from '@/shared/constants/uiText';
import styles from './StatementCards.module.css';

interface StatementCardProps {
  readonly eyebrow: string;
  readonly statement: Statement;
}

function StatementCard({ eyebrow, statement }: StatementCardProps): JSX.Element {
  return (
    <Card as="li" padding="lg" className={styles.card}>
      <p className={styles.eyebrow}>{eyebrow}</p>
      <h3 className={styles.title}>{statement.title}</h3>
      <p className={styles.text}>{statement.text}</p>
    </Card>
  );
}

/** Misión y visión (Nosotros), con el texto literal de company.json. */
export function StatementCards(): JSX.Element {
  const { mission, vision } = useCompanyInfo();
  return (
    <ul className={styles.grid}>
      <StatementCard eyebrow={UI_TEXT.company.mission} statement={mission} />
      <StatementCard eyebrow={UI_TEXT.company.vision} statement={vision} />
    </ul>
  );
}
