import { useSuspenseQuery } from '@tanstack/react-query';
import { useDependencies } from '@/presentation/providers/dependencyContext';
import { toLocationView, type LocationView } from './contactLinks';
import { queries } from './queries';

/**
 * Ubicación de la sede con la dirección en una línea y el enlace "Cómo llegar".
 * (No se llama `useLocation` para no confundirse con el hook de React Router.)
 */
export function useSchoolLocation(): LocationView {
  return useSuspenseQuery({ ...queries.location(useDependencies()), select: toLocationView }).data;
}
