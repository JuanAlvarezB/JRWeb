import { describe, expect, it } from 'vitest';
import { createContainer, createStaticRepositories } from '@/di/container';
import { InvalidContentError } from '@/domain/errors/InvalidContentError';
import { StaticPlanRepository } from '@/data/repositories/StaticPlanRepository';
import { InMemoryPlanRepository, inMemoryRepositories } from '../domain/fakes';
import { at, plans } from '../domain/samples';

describe('createContainer con el contenido estático (release 1)', () => {
  const container = createContainer();

  it('cada caso de uso responde con el contenido real', async () => {
    expect((await container.getCompanyInfo.execute()).nit).toBe('901722359-5');
    expect((await container.listServices.execute()).map((s) => s.category)).toEqual([
      'A2',
      'B1',
      'C1',
    ]);
    expect((await container.listPlans.byCategory('B1')).hours.driving).toBe(20);
    expect((await container.getLocation.execute()).address.city).toBe('Cereté');
    expect((await container.listContactChannels.execute(['whatsapp'])).length).toBe(1);
    expect((await container.getWhatsAppMessages.execute()).general).toMatch(/página web/);
    expect((await container.getClassSchedule.execute()).blocks.length).toBe(3);
    expect((await container.listFaqs.execute({ page: 'plans' })).length).toBe(4);
    expect((await container.listTestimonials.execute()).rating.score).toBe(5);
  });

  it('la política de datos se carga aparte (import dinámico) y con su índice', async () => {
    const policy = await container.getDataPolicy.execute();
    expect(policy.title).toMatch(/Tratamiento de Datos Personales/i);
    expect(policy.sections.length).toBeGreaterThan(20);
  });

  it('cada llamada crea repositorios nuevos: dos contenedores no comparten caché', () => {
    const first = createStaticRepositories();
    expect(createStaticRepositories().plans).not.toBe(first.plans);
  });
});

describe('createContainer con otros repositorios (como en la fase 2)', () => {
  it('usa los repositorios inyectados sin cambiar los casos de uso', async () => {
    const container = createContainer(inMemoryRepositories());
    expect((await container.getCompanyInfo.execute()).summary).toMatch(/^Somos un Centro/);
    expect((await container.listPlans.execute()).map((plan) => plan.category)).toEqual([
      'A2',
      'B1',
      'C1',
    ]);
  });

  it('basta reemplazar un repositorio para cambiar su fuente', async () => {
    const onlyC1 = new InMemoryPlanRepository([at(plans, 0)]);
    const container = createContainer(inMemoryRepositories({ plans: onlyC1 }));
    expect((await container.listPlans.execute()).map((plan) => plan.category)).toEqual(['C1']);
  });

  it('un contenido inválido llega como rechazo del caso de uso, no como excepción', async () => {
    const broken = new StaticPlanRepository([{ category: 'B1' }]);
    const container = createContainer(inMemoryRepositories({ plans: broken }));
    await expect(container.listPlans.execute()).rejects.toBeInstanceOf(InvalidContentError);
  });
});
