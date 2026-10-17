/**
 * Composition root: el único lugar que instancia repositorios concretos y los inyecta
 * en los casos de uso. La presentación recibe el resultado por el `DependencyProvider`.
 *
 * Para cambiar de fuente (fase 2: Supabase) se crean repositorios nuevos en `data/`
 * y se cambia `createStaticRepositories()` por la nueva fábrica en `createContainer`.
 * Dominio, hooks y componentes no cambian. Ejemplo en el README, sección
 * "Cambiar la fuente de datos".
 */
import companyContent from '@/data/content/company.json';
import contactContent from '@/data/content/contact.json';
import faqContent from '@/data/content/faq.json';
import locationContent from '@/data/content/location.json';
import plansContent from '@/data/content/plans.json';
import scheduleContent from '@/data/content/schedule.json';
import servicesContent from '@/data/content/services.json';
import testimonialsContent from '@/data/content/testimonials.json';
import { StaticCompanyRepository } from '@/data/repositories/StaticCompanyRepository';
import { StaticContactRepository } from '@/data/repositories/StaticContactRepository';
import { StaticFaqRepository } from '@/data/repositories/StaticFaqRepository';
import { StaticLegalDocumentRepository } from '@/data/repositories/StaticLegalDocumentRepository';
import { StaticLocationRepository } from '@/data/repositories/StaticLocationRepository';
import { StaticPlanRepository } from '@/data/repositories/StaticPlanRepository';
import { StaticScheduleRepository } from '@/data/repositories/StaticScheduleRepository';
import { StaticServiceRepository } from '@/data/repositories/StaticServiceRepository';
import { StaticTestimonialRepository } from '@/data/repositories/StaticTestimonialRepository';
import type { CompanyRepository } from '@/domain/repositories/CompanyRepository';
import type { ContactRepository } from '@/domain/repositories/ContactRepository';
import type { FaqRepository } from '@/domain/repositories/FaqRepository';
import type { LegalDocumentRepository } from '@/domain/repositories/LegalDocumentRepository';
import type { LocationRepository } from '@/domain/repositories/LocationRepository';
import type { PlanRepository } from '@/domain/repositories/PlanRepository';
import type { ScheduleRepository } from '@/domain/repositories/ScheduleRepository';
import type { ServiceRepository } from '@/domain/repositories/ServiceRepository';
import type { TestimonialRepository } from '@/domain/repositories/TestimonialRepository';
import { GetClassSchedule } from '@/domain/usecases/GetClassSchedule';
import { GetCompanyInfo } from '@/domain/usecases/GetCompanyInfo';
import { GetDataPolicy } from '@/domain/usecases/GetDataPolicy';
import { GetLocation } from '@/domain/usecases/GetLocation';
import { GetWhatsAppMessages } from '@/domain/usecases/GetWhatsAppMessages';
import { ListContactChannels } from '@/domain/usecases/ListContactChannels';
import { ListFaqs } from '@/domain/usecases/ListFaqs';
import { ListPlans } from '@/domain/usecases/ListPlans';
import { ListServices } from '@/domain/usecases/ListServices';
import { ListTestimonials } from '@/domain/usecases/ListTestimonials';
import type { AppDependencies } from '@/presentation/providers/AppDependencies';

/** Un repositorio por contrato del dominio. */
export interface Repositories {
  readonly company: CompanyRepository;
  readonly services: ServiceRepository;
  readonly plans: PlanRepository;
  readonly location: LocationRepository;
  readonly contact: ContactRepository;
  readonly schedule: ScheduleRepository;
  readonly faqs: FaqRepository;
  readonly testimonials: TestimonialRepository;
  readonly legalDocuments: LegalDocumentRepository;
}

/** Descarga la política (≈ 58 KB) en un fragmento aparte, solo cuando se pide. */
function loadDataPolicyMarkdown(): Promise<string> {
  return import('@/data/content/legal/data-policy.md?raw').then((module) => module.default);
}

/**
 * Release 1: contenido estático de `src/data/content/`, incluido en la build.
 * Cada repositorio valida su archivo la primera vez que se le pide.
 */
export function createStaticRepositories(): Repositories {
  return {
    company: new StaticCompanyRepository(companyContent),
    services: new StaticServiceRepository(servicesContent),
    plans: new StaticPlanRepository(plansContent),
    location: new StaticLocationRepository(locationContent),
    contact: new StaticContactRepository(contactContent),
    schedule: new StaticScheduleRepository(scheduleContent),
    faqs: new StaticFaqRepository(faqContent),
    testimonials: new StaticTestimonialRepository(testimonialsContent),
    legalDocuments: new StaticLegalDocumentRepository(loadDataPolicyMarkdown),
  };
}

/**
 * Construye los casos de uso con los repositorios indicados.
 *
 * @param repositories - Por defecto, el contenido estático. Las pruebas pasan
 *   repositorios en memoria.
 * @returns Los casos de uso que espera el `DependencyProvider`.
 */
export function createContainer(
  repositories: Repositories = createStaticRepositories(),
): AppDependencies {
  return {
    getCompanyInfo: new GetCompanyInfo(repositories.company),
    listServices: new ListServices(repositories.services),
    listPlans: new ListPlans(repositories.plans),
    getLocation: new GetLocation(repositories.location),
    listContactChannels: new ListContactChannels(repositories.contact),
    getWhatsAppMessages: new GetWhatsAppMessages(repositories.contact),
    getClassSchedule: new GetClassSchedule(repositories.schedule),
    listFaqs: new ListFaqs(repositories.faqs),
    listTestimonials: new ListTestimonials(repositories.testimonials),
    getDataPolicy: new GetDataPolicy(repositories.legalDocuments),
  };
}
