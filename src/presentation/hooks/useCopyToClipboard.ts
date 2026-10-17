import { useEffect, useRef, useState } from 'react';
import { COPIED_FEEDBACK_DURATION_MS } from '@/shared/constants/designTokens';

export interface CopyToClipboard {
  /** Último valor copiado mientras dura el aviso "Copiado"; `null` si no hay. */
  readonly copiedValue: string | null;
  /** Copia el valor; si el navegador no lo permite, no muestra el aviso. */
  readonly copy: (value: string) => Promise<void>;
}

/** Copiar al portapapeles con el aviso "Copiado" durante unos segundos (DESIGN.md). */
export function useCopyToClipboard(): CopyToClipboard {
  const [copiedValue, setCopiedValue] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(
    () => () => {
      clearTimeout(timer.current);
    },
    [],
  );

  async function copy(value: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // Sin permiso o sin HTTPS: el dato sigue visible para copiarlo a mano.
      return;
    }
    clearTimeout(timer.current);
    setCopiedValue(value);
    timer.current = setTimeout(() => {
      setCopiedValue(null);
    }, COPIED_FEEDBACK_DURATION_MS);
  }

  return { copiedValue, copy };
}
