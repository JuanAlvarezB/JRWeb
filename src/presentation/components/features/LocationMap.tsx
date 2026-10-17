import { useEffect, useRef, useState, type JSX } from 'react';
import { Button } from '@/presentation/components/ui/Button';
import type { LocationView } from '@/presentation/hooks/contactLinks';
import { UI_TEXT } from '@/shared/constants/uiText';
import { cx } from '@/shared/utils/cx';
import styles from './LocationMap.module.css';
import { MapIllustration } from './MapIllustration';

interface LocationMapProps {
  readonly location: LocationView;
  readonly className?: string | undefined;
}

const { location: TEXT } = UI_TEXT;

/**
 * Mapa con fachada (DESIGN.md §5, bloque de ubicación): muestra el plano ilustrado y
 * solo carga Google Maps cuando la persona toca "Ver mapa". Así la página no descarga
 * el mapa ni recibe cookies de Google sin una acción explícita. Sin mapa embebido en
 * el contenido, "Ver mapa" abre el perfil de Google.
 */
export function LocationMap({ location, className }: LocationMapProps): JSX.Element {
  const [loaded, setLoaded] = useState(false);
  const frame = useRef<HTMLIFrameElement>(null);
  const { embedUrl } = location;

  // Al cambiar la fachada por el mapa, el foco pasa al mapa (el botón desaparece).
  useEffect(() => {
    if (loaded) frame.current?.focus();
  }, [loaded]);

  if (loaded && embedUrl !== undefined) {
    return (
      <div className={cx(styles.map, className)}>
        <iframe
          ref={frame}
          src={embedUrl}
          title={TEXT.mapTitle(location.businessName)}
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className={styles.frame}
        />
      </div>
    );
  }

  return (
    <div className={cx(styles.map, className)}>
      <MapIllustration />
      <div className={styles.overlay}>
        {embedUrl === undefined ? (
          <Button
            variant="outline"
            icon="mapPin"
            href={location.googleProfileUrl ?? location.directionsUrl}
            newTab
            className={styles.button}
          >
            {TEXT.showMap}
          </Button>
        ) : (
          <Button
            variant="outline"
            icon="mapPin"
            onClick={() => {
              setLoaded(true);
            }}
            className={styles.button}
          >
            {TEXT.showMap}
          </Button>
        )}
      </div>
    </div>
  );
}
