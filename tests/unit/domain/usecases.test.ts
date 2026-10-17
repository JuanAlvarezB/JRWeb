import { describe, expect, it } from 'vitest';
import { NotFoundError } from '@/domain/errors/NotFoundError';
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
import {
  InMemoryCompanyRepository,
  InMemoryContactRepository,
  InMemoryFaqRepository,
  InMemoryLegalDocumentRepository,
  InMemoryLocationRepository,
  InMemoryPlanRepository,
  InMemoryScheduleRepository,
  InMemoryServiceRepository,
  InMemoryTestimonialRepository,
} from './fakes';
import {
  channels,
  company,
  dataPolicy,
  faqs,
  location,
  plans,
  rating,
  schedule,
  services,
  testimonials,
  whatsAppMessages,
} from './samples';

describe('casos de uso', () => {
  it('ListPlans ordena por categoría y busca por categoría', async () => {
    const useCase = new ListPlans(new InMemoryPlanRepository(plans));
    expect((await useCase.execute()).map((plan) => plan.category)).toEqual(['A2', 'B1', 'C1']);
    expect((await useCase.byCategory('B1')).hours.driving).toBe(20);
  });

  it('ListPlans falla con NotFoundError si la categoría no existe', async () => {
    const useCase = new ListPlans(new InMemoryPlanRepository(plans.slice(0, 1)));
    await expect(useCase.byCategory('A2')).rejects.toBeInstanceOf(NotFoundError);
  });

  it('ListServices ordena por categoría', async () => {
    const result = await new ListServices(new InMemoryServiceRepository(services)).execute();
    expect(result.map((service) => service.category)).toEqual(['A2', 'B1']);
  });

  it('ListFaqs ordena por tema y filtra por tema o página', async () => {
    const useCase = new ListFaqs(new InMemoryFaqRepository(faqs));
    expect((await useCase.execute()).map((faq) => faq.id)).toEqual([
      'edad',
      'requisitos',
      'precio',
      'ubicacion',
    ]);
    // En Planes, "¿Cuánto cuesta?" va antes que "¿Qué requisitos?" (orden propio de la página).
    expect((await useCase.execute({ page: 'plans' })).map((faq) => faq.id)).toEqual([
      'edad',
      'precio',
      'requisitos',
    ]);
    expect((await useCase.execute({ topic: 'location' })).map((faq) => faq.id)).toEqual([
      'ubicacion',
    ]);
  });

  it('ListContactChannels filtra por tipo de canal', async () => {
    const useCase = new ListContactChannels(
      new InMemoryContactRepository(channels, whatsAppMessages),
    );
    expect(await useCase.execute()).toHaveLength(3);
    expect((await useCase.execute(['instagram', 'tiktok'])).map((channel) => channel.kind)).toEqual(
      ['instagram'],
    );
  });

  it('ListTestimonials devuelve calificación y opiniones juntas', async () => {
    const overview = await new ListTestimonials(
      new InMemoryTestimonialRepository(testimonials, rating),
    ).execute();
    expect(overview.rating.reviewCount).toBe(5);
    expect(overview.testimonials).toHaveLength(2);
  });

  it('los casos de uso de lectura devuelven lo del repositorio', async () => {
    expect((await new GetCompanyInfo(new InMemoryCompanyRepository(company)).execute()).nit).toBe(
      '901722359-5',
    );
    expect(
      (await new GetLocation(new InMemoryLocationRepository(location)).execute()).address.city,
    ).toBe('Cereté');
    expect(
      (
        await new GetWhatsAppMessages(
          new InMemoryContactRepository(channels, whatsAppMessages),
        ).execute()
      ).general,
    ).toMatch(/página web/);
    expect(
      (await new GetClassSchedule(new InMemoryScheduleRepository(schedule)).execute()).blocks,
    ).toHaveLength(3);
    expect(
      (await new GetDataPolicy(new InMemoryLegalDocumentRepository(dataPolicy)).execute()).status,
    ).toBe('approved');
  });
});
