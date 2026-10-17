import type { GetClassSchedule } from '@/domain/usecases/GetClassSchedule';
import type { GetCompanyInfo } from '@/domain/usecases/GetCompanyInfo';
import type { GetDataPolicy } from '@/domain/usecases/GetDataPolicy';
import type { GetLocation } from '@/domain/usecases/GetLocation';
import type { GetWhatsAppMessages } from '@/domain/usecases/GetWhatsAppMessages';
import type { ListContactChannels } from '@/domain/usecases/ListContactChannels';
import type { ListFaqs } from '@/domain/usecases/ListFaqs';
import type { ListPlans } from '@/domain/usecases/ListPlans';
import type { ListServices } from '@/domain/usecases/ListServices';
import type { ListTestimonials } from '@/domain/usecases/ListTestimonials';

/**
 * Casos de uso que la presentación necesita. La presentación declara el contrato y
 * `src/di/container.ts` lo cumple: así los componentes nunca conocen `data/` y
 * cambiar de fuente (fase 2: Supabase) no toca esta capa.
 */
export interface AppDependencies {
  readonly getCompanyInfo: GetCompanyInfo;
  readonly listServices: ListServices;
  readonly listPlans: ListPlans;
  readonly getLocation: GetLocation;
  readonly listContactChannels: ListContactChannels;
  readonly getWhatsAppMessages: GetWhatsAppMessages;
  readonly getClassSchedule: GetClassSchedule;
  readonly listFaqs: ListFaqs;
  readonly listTestimonials: ListTestimonials;
  readonly getDataPolicy: GetDataPolicy;
}
