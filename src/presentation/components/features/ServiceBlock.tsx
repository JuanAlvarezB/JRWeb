import type { JSX } from 'react';
import type { Service } from '@/domain/entities/Service';
import { ActionLink } from '@/presentation/components/ui/ActionLink';
import { Card } from '@/presentation/components/ui/Card';
import { UI_TEXT } from '@/shared/constants/uiText';
import { cx } from '@/shared/utils/cx';
import styles from './ServiceBlock.module.css';

interface ServiceBlockProps {
  readonly service: Service;
  /** WhatsApp con "quiero conocer los requisitos" de la categoría. */
  readonly requirementsHref: string;
  /** Foto a la izquierda (bloques pares), para alternar como en el mockup. */
  readonly reversed?: boolean;
}

const { services: TEXT } = UI_TEXT;

/**
 * Bloque de un servicio (Servicios): texto y ficha con vehículos, servicio y edad.
 * La foto 4:3 solo aparece cuando el contenido la trae (DESIGN.md §6, decisión del
 * 15 oct 2026); sin foto, el bloque ocupa una columna.
 */
export function ServiceBlock({
  service,
  requirementsHref,
  reversed = false,
}: ServiceBlockProps): JSX.Element {
  const { photo } = service;
  const facts: readonly (readonly [string, string])[] = [
    [TEXT.vehicles, service.vehicles],
    [TEXT.service, UI_TEXT.serviceType[service.serviceType]],
    [TEXT.age, service.ageRequirement],
  ];
  const titleId = `servicio-${service.category.toLowerCase()}`;

  return (
    <article
      aria-labelledby={titleId}
      className={cx(
        styles.block,
        photo !== undefined && styles.withPhoto,
        reversed && styles.reversed,
      )}
    >
      <div className={styles.text}>
        <p className={styles.eyebrow}>{TEXT.eyebrow(service.category)}</p>
        <h2 id={titleId} className={styles.title}>
          {service.title}
        </h2>
        <p className={styles.audience}>{service.audience}</p>
        <Card padding="none" hoverable={false} className={styles.facts}>
          <dl className={styles.factList}>
            {facts.map(([label, value]) => (
              <div key={label} className={styles.fact}>
                <dt className={styles.factLabel}>{label}</dt>
                <dd className={styles.factValue}>{value}</dd>
              </div>
            ))}
          </dl>
        </Card>
        <ActionLink href={requirementsHref} newTab className={styles.link}>
          {TEXT.askRequirements}
        </ActionLink>
      </div>
      {photo !== undefined && (
        <img
          src={photo.src}
          alt={photo.alt}
          loading="lazy"
          decoding="async"
          className={styles.photo}
        />
      )}
    </article>
  );
}
