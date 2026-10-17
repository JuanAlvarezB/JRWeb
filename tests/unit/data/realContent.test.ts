import { describe, expect, it } from 'vitest';
import { totalHours } from '@/domain/entities/CourseHours';
import { primaryEntry } from '@/domain/entities/ContactChannel';
import { StaticCompanyRepository } from '@/data/repositories/StaticCompanyRepository';
import { StaticContactRepository } from '@/data/repositories/StaticContactRepository';
import { StaticFaqRepository } from '@/data/repositories/StaticFaqRepository';
import { StaticLegalDocumentRepository } from '@/data/repositories/StaticLegalDocumentRepository';
import { StaticLocationRepository } from '@/data/repositories/StaticLocationRepository';
import { StaticPlanRepository } from '@/data/repositories/StaticPlanRepository';
import { StaticScheduleRepository } from '@/data/repositories/StaticScheduleRepository';
import { StaticServiceRepository } from '@/data/repositories/StaticServiceRepository';
import { StaticTestimonialRepository } from '@/data/repositories/StaticTestimonialRepository';
import { validateContent } from '@/data/validateContent';
import { readContent, readJson } from './readContent';

describe('contenido real publicado', () => {
  it('pasa esquemas, reglas del dominio y coherencia entre archivos', async () => {
    expect(await validateContent(readContent)).toEqual([]);
  });

  it('empresa: NIT y misión literal', async () => {
    const company = await new StaticCompanyRepository(await readJson('company.json')).get();
    expect(company.nit).toBe('901722359-5');
    expect(company.mission.text).toMatch(/^Formar conductores con capacidades/);
    expect(company.vision.text).toMatch(/su facilidades ofrecidas\.$/);
  });

  it('planes: A2, B1 y C1 con 43, 50 y 65 horas, sin precio', async () => {
    const plans = await new StaticPlanRepository(await readJson('plans.json')).list();
    expect(plans.map((plan) => [plan.category, totalHours(plan.hours)])).toEqual([
      ['A2', 43],
      ['B1', 50],
      ['C1', 65],
    ]);
    for (const plan of plans) expect(Object.keys(plan)).not.toContain('price');
  });

  it('servicios: tres categorías sin fotos todavía', async () => {
    const services = await new StaticServiceRepository(await readJson('services.json')).list();
    expect(services.map((service) => service.minimumAge)).toEqual([16, 16, 18]);
    expect(services.every((service) => service.photo === undefined)).toBe(true);
  });

  it('ubicación: perfil, coordenadas exactas del pin y mapa embebido de Google', async () => {
    const location = await new StaticLocationRepository(await readJson('location.json')).get();
    expect(location.coordinates).toEqual({ latitude: 8.8877998, longitude: -75.7887601 });
    expect(location.googleProfileUrl).toBe('https://maps.app.goo.gl/Zko5WSsCAiaZyExX7');
    expect(location.embedUrl).toMatch(/^https:\/\/www\.google\.com\/maps\/embed/);
  });

  it('contacto: WhatsApp principal, seis canales y mensajes que indican la web', async () => {
    const repository = new StaticContactRepository(await readJson('contact.json'));
    const channels = await repository.listChannels();
    expect(channels.map((channel) => channel.kind)).toEqual([
      'whatsapp',
      'phone',
      'email',
      'facebook',
      'instagram',
      'tiktok',
    ]);
    expect(primaryEntry(channels, 'whatsapp')?.value).toBe('+573165641048');
    expect((await repository.getWhatsAppMessages()).priceInquiry).toContain('vi en la página web');
  });

  it('horarios, preguntas y opiniones', async () => {
    const schedule = await new StaticScheduleRepository(await readJson('schedule.json')).get();
    expect(schedule.blocks.map((block) => block.id)).toEqual([
      'theory-day',
      'theory-night',
      'practice',
    ]);
    expect(await new StaticFaqRepository(await readJson('faq.json')).list()).toHaveLength(7);
    const testimonials = new StaticTestimonialRepository(await readJson('testimonials.json'));
    expect((await testimonials.getRating()).score).toBe(5);
    expect((await testimonials.list()).map((item) => item.author)).toEqual([undefined, 'Cruz P.']);
  });

  it('política: 21 secciones oficiales + anexo web, con anclas y sin notas internas', async () => {
    const policy = await new StaticLegalDocumentRepository(() =>
      readContent('legal/data-policy.md'),
    ).getDataPolicy();
    expect(policy.status).toBe('approved');
    expect(policy.effectiveDate).toBe('2024-01-15');
    expect(policy.sections).toHaveLength(22);
    expect(policy.sections[0]?.id).toBe('1-marco-normativo-e-identificacion-del-responsable');
    expect(policy.sections.at(-1)?.id).toBe('analitica-del-sitio-web');
    expect(policy.sections.some((section) => section.body.includes('<!--'))).toBe(false);
  });
});
