import type { JSX } from 'react';
import { useServices } from '@/presentation/hooks/useServices';
import styles from './ServiceSummaryList.module.css';

/** Resumen de servicios del Inicio: categoría y una línea de lo que cubre. */
export function ServiceSummaryList(): JSX.Element {
  const services = useServices();
  return (
    <dl className={styles.list}>
      {services.map((service) => (
        <div key={service.category} className={styles.row}>
          <dt className={styles.category}>{service.category}</dt>
          <dd className={styles.summary}>{service.summary}</dd>
        </div>
      ))}
    </dl>
  );
}
