import type { JSX } from 'react';
import { Button } from '@/presentation/components/ui/Button';
import { ROUTES } from '@/shared/constants/routes';
import { UI_TEXT } from '@/shared/constants/uiText';
import styles from './ErrorFallback.module.css';

const { errors: TEXT } = UI_TEXT;

/**
 * Aviso de error. No usa datos del contenido (que pudo ser lo que falló): solo textos
 * de la interfaz, recargar y un enlace completo al inicio.
 */
export function ErrorFallback(): JSX.Element {
  return (
    <div role="alert" className={styles.fallback}>
      <h1 className={styles.title}>{TEXT.title}</h1>
      <p className={styles.text}>{TEXT.text}</p>
      <div className={styles.actions}>
        <Button
          onClick={() => {
            window.location.reload();
          }}
        >
          {TEXT.reload}
        </Button>
        <Button href={ROUTES.home} variant="outline">
          {TEXT.home}
        </Button>
      </div>
    </div>
  );
}
