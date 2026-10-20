import type { IconName } from '@/presentation/components/ui/iconRegistry';

/** Ícono de cada diferenciador de company.json; uno nuevo usa el check. */
const DIFFERENTIATOR_ICONS: Readonly<Record<string, IconName>> = {
  'instructores-certificados': 'award',
  'horarios-flexibles': 'clock',
};

export const SCHEDULE_DIFFERENTIATOR_ID = 'horarios-flexibles';

export function differentiatorIcon(id: string): IconName {
  return DIFFERENTIATOR_ICONS[id] ?? 'check';
}
