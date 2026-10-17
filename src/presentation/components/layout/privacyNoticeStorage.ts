/**
 * Registro técnico de "aviso leído" (handoff §2 y anexo web de la política): no tiene
 * datos personales. El almacenamiento puede no estar disponible (modo privado, sitio
 * bloqueado): en ese caso el aviso se cierra en la visita y vuelve en la próxima.
 *
 * Funciona como una fuente externa para `useSyncExternalStore`: el aviso lee el
 * registro y se entera cuando cambia.
 */
export const PRIVACY_NOTICE_KEY = 'aviso-privacidad';
export const PRIVACY_NOTICE_SEEN = 'visto';

const listeners = new Set<() => void>();
/** Cerrado en esta visita aunque no se haya podido guardar. */
let dismissedThisVisit = false;

export function wasPrivacyNoticeSeen(): boolean {
  if (dismissedThisVisit) return true;
  try {
    return window.localStorage.getItem(PRIVACY_NOTICE_KEY) === PRIVACY_NOTICE_SEEN;
  } catch {
    return false;
  }
}

/** En el servidor (prerender) el aviso no se pinta: lo decide el navegador. */
export function privacyNoticeSeenOnServer(): boolean {
  return true;
}

export function markPrivacyNoticeSeen(): void {
  dismissedThisVisit = true;
  try {
    window.localStorage.setItem(PRIVACY_NOTICE_KEY, PRIVACY_NOTICE_SEEN);
  } catch {
    // Sin almacenamiento: basta con `dismissedThisVisit`.
  }
  for (const listener of listeners) listener();
}

export function subscribeToPrivacyNotice(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
