import { queryOptions, type DataTag, type QueryKey } from '@tanstack/react-query';
import type { ClassSchedule } from '@/domain/entities/ClassSchedule';
import type { CompanyInfo } from '@/domain/entities/CompanyInfo';
import type { ContactChannel, ContactChannelKind } from '@/domain/entities/ContactChannel';
import type { Faq } from '@/domain/entities/Faq';
import type { LegalDocument } from '@/domain/entities/LegalDocument';
import type { Location } from '@/domain/entities/Location';
import type { Plan } from '@/domain/entities/Plan';
import type { Service } from '@/domain/entities/Service';
import type { WhatsAppMessages } from '@/domain/entities/WhatsAppMessages';
import type { FaqFilter } from '@/domain/usecases/ListFaqs';
import type { TestimonialsOverview } from '@/domain/usecases/ListTestimonials';
import type { AppDependencies } from '@/presentation/providers/AppDependencies';

/**
 * Claves de caché de TanStack Query: la única fuente, para que el hook y el prerender
 * (que precarga y envía la caché al navegador) usen exactamente la misma.
 */
export const queryKeys = {
  companyInfo: ['company-info'],
  services: ['services'],
  plans: ['plans'],
  location: ['location'],
  contactChannels: (kinds?: readonly ContactChannelKind[]) =>
    ['contact-channels', kinds ?? 'all'] as const,
  whatsAppMessages: ['whatsapp-messages'],
  schedule: ['schedule'],
  faqs: (filter: FaqFilter = {}) => ['faqs', filter] as const,
  testimonials: ['testimonials'],
  dataPolicy: ['data-policy'],
} as const;

/** Consulta de contenido: clave (con el tipo del resultado) y caso de uso. */
export interface ContentQuery<T> {
  readonly queryKey: DataTag<QueryKey, T, Error>;
  readonly queryFn: () => Promise<T>;
}

function contentQuery<T>(queryKey: QueryKey, queryFn: () => Promise<T>): ContentQuery<T> {
  return { queryKey: queryOptions({ queryKey, queryFn }).queryKey, queryFn };
}

/**
 * Definición de cada consulta (clave + caso de uso). Los hooks las usan con
 * `useSuspenseQuery`; el prerender, con `queryClient.query(...)`.
 */
export const queries = {
  companyInfo: (deps: AppDependencies): ContentQuery<CompanyInfo> =>
    contentQuery(queryKeys.companyInfo, () => deps.getCompanyInfo.execute()),
  services: (deps: AppDependencies): ContentQuery<readonly Service[]> =>
    contentQuery(queryKeys.services, () => deps.listServices.execute()),
  plans: (deps: AppDependencies): ContentQuery<readonly Plan[]> =>
    contentQuery(queryKeys.plans, () => deps.listPlans.execute()),
  location: (deps: AppDependencies): ContentQuery<Location> =>
    contentQuery(queryKeys.location, () => deps.getLocation.execute()),
  contactChannels: (
    deps: AppDependencies,
    kinds?: readonly ContactChannelKind[],
  ): ContentQuery<readonly ContactChannel[]> =>
    contentQuery(queryKeys.contactChannels(kinds), () => deps.listContactChannels.execute(kinds)),
  whatsAppMessages: (deps: AppDependencies): ContentQuery<WhatsAppMessages> =>
    contentQuery(queryKeys.whatsAppMessages, () => deps.getWhatsAppMessages.execute()),
  schedule: (deps: AppDependencies): ContentQuery<ClassSchedule> =>
    contentQuery(queryKeys.schedule, () => deps.getClassSchedule.execute()),
  faqs: (deps: AppDependencies, filter: FaqFilter = {}): ContentQuery<readonly Faq[]> =>
    contentQuery(queryKeys.faqs(filter), () => deps.listFaqs.execute(filter)),
  testimonials: (deps: AppDependencies): ContentQuery<TestimonialsOverview> =>
    contentQuery(queryKeys.testimonials, () => deps.listTestimonials.execute()),
  dataPolicy: (deps: AppDependencies): ContentQuery<LegalDocument> =>
    contentQuery(queryKeys.dataPolicy, () => deps.getDataPolicy.execute()),
};
