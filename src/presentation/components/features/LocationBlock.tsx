import type { JSX } from 'react';
import { ActionLink } from '@/presentation/components/ui/ActionLink';
import { Button } from '@/presentation/components/ui/Button';
import { Card } from '@/presentation/components/ui/Card';
import { Icon } from '@/presentation/components/ui/Icon';
import { Pressable } from '@/presentation/components/ui/Pressable';
import { useSchedule } from '@/presentation/hooks/useSchedule';
import { useSchoolLocation } from '@/presentation/hooks/useSchoolLocation';
import { UI_TEXT } from '@/shared/constants/uiText';
import styles from './LocationBlock.module.css';
import { LocationMap } from './LocationMap';
import { ScheduleDetails } from './ScheduleDetails';

/**
 * Información bajo la dirección:
 * - `schedule`: resumen de horarios (Inicio).
 * - `googleName`: cómo aparece la sede en Google (Contáctanos, donde los horarios
 *   tienen su propia sección).
 */
export type LocationDetails = 'schedule' | 'googleName';

interface LocationBlockProps {
  readonly details: LocationDetails;
}

const { location: TEXT } = UI_TEXT;

/**
 * Bloque de ubicación (DESIGN.md §5): mapa y tarjeta con la dirección, información
 * de apoyo, "Cómo llegar" y "Abrir en Waze". En móvil, el mapa va primero.
 */
export function LocationBlock({ details }: LocationBlockProps): JSX.Element {
  const location = useSchoolLocation();
  const schedule = useSchedule();

  return (
    <div className={styles.block}>
      <LocationMap location={location} className={styles.map} />
      <Card padding="md" hoverable={false} className={styles.card}>
        <p className={styles.label}>{TEXT.addressLabel}</p>
        <Pressable
          href={location.googleProfileUrl ?? location.directionsUrl}
          newTab
          className={styles.address}
        >
          <Icon name="mapPin" className={styles.addressIcon} />
          <span>{details === 'schedule' ? location.shortAddress : location.fullAddress}</span>
        </Pressable>

        {details === 'schedule' ? (
          <div className={styles.extra}>
            <p className={styles.label}>{TEXT.schedulesLabel}</p>
            <ScheduleDetails schedule={schedule} variant="summary" />
          </div>
        ) : (
          <p className={styles.googleName}>{TEXT.googleName(location.businessName)}</p>
        )}

        <div className={styles.actions}>
          <Button href={location.directionsUrl} newTab icon="navigation" fullWidthOnMobile>
            {TEXT.directions}
          </Button>
          <ActionLink href={location.wazeUrl} newTab>
            {TEXT.waze}
          </ActionLink>
        </div>
      </Card>
    </div>
  );
}
