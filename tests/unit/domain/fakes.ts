/** Repositorios falsos en memoria: los casos de uso se prueban sin archivos ni red. */
import type { Repositories } from '@/di/container';
import type { ClassSchedule } from '@/domain/entities/ClassSchedule';
import type { CompanyInfo } from '@/domain/entities/CompanyInfo';
import type { ContactChannel } from '@/domain/entities/ContactChannel';
import type { Faq } from '@/domain/entities/Faq';
import type { LegalDocument } from '@/domain/entities/LegalDocument';
import type { Location } from '@/domain/entities/Location';
import type { Plan } from '@/domain/entities/Plan';
import type { Service } from '@/domain/entities/Service';
import type { RatingSummary, Testimonial } from '@/domain/entities/Testimonial';
import type { WhatsAppMessages } from '@/domain/entities/WhatsAppMessages';
import type { CompanyRepository } from '@/domain/repositories/CompanyRepository';
import type { ContactRepository } from '@/domain/repositories/ContactRepository';
import type { FaqRepository } from '@/domain/repositories/FaqRepository';
import type { LegalDocumentRepository } from '@/domain/repositories/LegalDocumentRepository';
import type { LocationRepository } from '@/domain/repositories/LocationRepository';
import type { PlanRepository } from '@/domain/repositories/PlanRepository';
import type { ScheduleRepository } from '@/domain/repositories/ScheduleRepository';
import type { ServiceRepository } from '@/domain/repositories/ServiceRepository';
import type { TestimonialRepository } from '@/domain/repositories/TestimonialRepository';
import * as sample from './samples';

export class InMemoryCompanyRepository implements CompanyRepository {
  constructor(private readonly data: CompanyInfo) {}
  get(): Promise<CompanyInfo> {
    return Promise.resolve(this.data);
  }
}

export class InMemoryServiceRepository implements ServiceRepository {
  constructor(private readonly data: readonly Service[]) {}
  list(): Promise<readonly Service[]> {
    return Promise.resolve(this.data);
  }
}

export class InMemoryPlanRepository implements PlanRepository {
  constructor(private readonly data: readonly Plan[]) {}
  list(): Promise<readonly Plan[]> {
    return Promise.resolve(this.data);
  }
}

export class InMemoryLocationRepository implements LocationRepository {
  constructor(private readonly data: Location) {}
  get(): Promise<Location> {
    return Promise.resolve(this.data);
  }
}

export class InMemoryContactRepository implements ContactRepository {
  constructor(
    private readonly channels: readonly ContactChannel[],
    private readonly messages: WhatsAppMessages,
  ) {}
  listChannels(): Promise<readonly ContactChannel[]> {
    return Promise.resolve(this.channels);
  }
  getWhatsAppMessages(): Promise<WhatsAppMessages> {
    return Promise.resolve(this.messages);
  }
}

export class InMemoryScheduleRepository implements ScheduleRepository {
  constructor(private readonly data: ClassSchedule) {}
  get(): Promise<ClassSchedule> {
    return Promise.resolve(this.data);
  }
}

export class InMemoryFaqRepository implements FaqRepository {
  constructor(private readonly data: readonly Faq[]) {}
  list(): Promise<readonly Faq[]> {
    return Promise.resolve(this.data);
  }
}

export class InMemoryTestimonialRepository implements TestimonialRepository {
  constructor(
    private readonly data: readonly Testimonial[],
    private readonly summary: RatingSummary,
  ) {}
  list(): Promise<readonly Testimonial[]> {
    return Promise.resolve(this.data);
  }
  getRating(): Promise<RatingSummary> {
    return Promise.resolve(this.summary);
  }
}

export class InMemoryLegalDocumentRepository implements LegalDocumentRepository {
  constructor(private readonly policy: LegalDocument) {}
  getDataPolicy(): Promise<LegalDocument> {
    return Promise.resolve(this.policy);
  }
}

/**
 * Todos los repositorios en memoria con los datos de `samples.ts`. Se inyectan en
 * `createContainer`, igual que lo haría la fase 2 con los repositorios de Supabase.
 */
export function inMemoryRepositories(overrides: Partial<Repositories> = {}): Repositories {
  return {
    company: new InMemoryCompanyRepository(sample.company),
    services: new InMemoryServiceRepository(sample.services),
    plans: new InMemoryPlanRepository(sample.plans),
    location: new InMemoryLocationRepository(sample.location),
    contact: new InMemoryContactRepository(sample.channels, sample.whatsAppMessages),
    schedule: new InMemoryScheduleRepository(sample.schedule),
    faqs: new InMemoryFaqRepository(sample.faqs),
    testimonials: new InMemoryTestimonialRepository(sample.testimonials, sample.rating),
    legalDocuments: new InMemoryLegalDocumentRepository(sample.dataPolicy),
    ...overrides,
  };
}
