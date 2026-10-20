import type { JSX } from 'react';
import { VisuallyHidden } from '@/presentation/components/ui/VisuallyHidden';
import { appConfig } from '@/shared/config/env';
import { UI_TEXT } from '@/shared/constants/uiText';
import styles from './EnvironmentBadge.module.css';

/** Etiqueta "QA" fija arriba a la izquierda (handoff §2). Solo existe en QA. */
export function EnvironmentBadge(): JSX.Element | null {
  if (!appConfig.isQa) return null;
  return (
    <p className={styles.badge}>
      <span aria-hidden="true">{UI_TEXT.environment.qaBadge}</span>
      <VisuallyHidden>{UI_TEXT.environment.qaDescription}</VisuallyHidden>
    </p>
  );
}
