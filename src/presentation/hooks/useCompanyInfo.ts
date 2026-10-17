import { useSuspenseQuery } from '@tanstack/react-query';
import type { CompanyInfo } from '@/domain/entities/CompanyInfo';
import { useDependencies } from '@/presentation/providers/dependencyContext';
import { queries } from './queries';

/** Razón social, NIT, misión, visión y diferenciadores (Nosotros, footer, SEO). */
export function useCompanyInfo(): CompanyInfo {
  return useSuspenseQuery(queries.companyInfo(useDependencies())).data;
}
