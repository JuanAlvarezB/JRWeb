/**
 * Textos de la interfaz (en español), centralizados.
 * El contenido del negocio (cursos, horarios, canales...) vive en src/data/content/.
 */
export const UI_TEXT = {
  brand: {
    name: 'Conducir J&R del Sinú',
    tagline: 'Centro de Enseñanza Automovilística',
  },
  a11y: {
    opensInNewTab: '(se abre en una pestaña nueva)',
  },
  speedometer: {
    totalCaption: 'horas en total',
  },
  setup: {
    environmentReady: (envName: string): string => `Entorno listo · ambiente: ${envName}`,
  },
} as const;
