import type { JSX } from 'react';
import { Card } from '@/presentation/components/ui/Card';
import { Icon } from '@/presentation/components/ui/Icon';
import { useCompanyInfo } from '@/presentation/hooks/useCompanyInfo';
import { useSchoolLocation } from '@/presentation/hooks/useSchoolLocation';
import { UI_TEXT } from '@/shared/constants/uiText';
import styles from './CompanyFactsCard.module.css';

/** "Datos de la empresa" (Nosotros): nombre comercial, NIT y dirección. */
export function CompanyFactsCard(): JSX.Element {
  const { brandName, tagline, nit } = useCompanyInfo();
  const { fullAddress } = useSchoolLocation();

  return (
    <Card padding="lg" className={styles.card}>
      <span className={styles.iconCircle}>
        <Icon name="warehouse" className={styles.icon} />
      </span>
      <div className={styles.facts}>
        <p className={styles.label}>{UI_TEXT.company.factsLabel}</p>
        <p className={styles.title}>{UI_TEXT.company.factsTitle(brandName, tagline)}</p>
        <p className={styles.text}>{UI_TEXT.company.factsText(nit, fullAddress)}</p>
      </div>
    </Card>
  );
}
