import type { JSX } from 'react';
import { useServices } from '@/presentation/hooks/useServices';
import { useWhatsAppLinkBuilder } from '@/presentation/hooks/useWhatsAppLink';
import { ServiceBlock } from './ServiceBlock';
import styles from './ServiceList.module.css';

/** Lista de servicios (Servicios): un bloque por categoría, alternando la foto. */
export function ServiceList(): JSX.Element {
  const services = useServices();
  const whatsAppLink = useWhatsAppLinkBuilder();
  return (
    <div className={styles.list}>
      {services.map((service, index) => (
        <ServiceBlock
          key={service.category}
          service={service}
          reversed={index % 2 === 1}
          requirementsHref={whatsAppLink({ topic: 'requirements', category: service.category })}
        />
      ))}
    </div>
  );
}
