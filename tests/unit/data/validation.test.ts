import { describe, expect, it } from 'vitest';
import { InvalidContentError } from '@/domain/errors/InvalidContentError';
import { mapDataPolicy } from '@/data/mappers/dataPolicyMapper';
import {
  parseFrontmatter,
  splitSections,
  stripFrontmatterAndComments,
} from '@/data/mappers/markdown';
import { mapContact } from '@/data/mappers/contactMapper';
import { mapFaqs } from '@/data/mappers/faqMapper';
import { mapPlans } from '@/data/mappers/plansMapper';
import { mapServices } from '@/data/mappers/servicesMapper';
import { StaticPlanRepository } from '@/data/repositories/StaticPlanRepository';
import { checkConsistency, validateContent } from '@/data/validateContent';
import { readContent, readJson } from './readContent';

const plan = {
  category: 'B1',
  name: 'Licencia B1',
  description: 'Automóviles de servicio particular.',
  serviceType: 'private',
  ageRequirement: 'Desde 16 años',
  hours: { theory: 25, workshop: 5, driving: 20 },
};

function issuesOf(run: () => unknown): readonly string[] {
  try {
    run();
    return [];
  } catch (error) {
    if (error instanceof InvalidContentError) return error.issues;
    throw error;
  }
}

describe('esquemas estrictos', () => {
  it('rechaza un precio agregado a un plan, con la ruta del campo', () => {
    expect(issuesOf(() => mapPlans([{ ...plan, precio: 850000 }]))).toEqual([
      expect.stringMatching(/^\[0\]: .*precio/u),
    ]);
  });

  it('rechaza tipos y valores no válidos', () => {
    const issues = issuesOf(() =>
      mapPlans([{ ...plan, category: 'B2', hours: { theory: '25', workshop: 5, driving: 20 } }]),
    );
    expect(issues.join('\n')).toMatch(/\[0\]\.category/u);
    expect(issues.join('\n')).toMatch(/\[0\]\.hours\.theory/u);
  });

  it('aplica también las reglas del dominio después del esquema', () => {
    expect(
      issuesOf(() => mapPlans([{ ...plan, hours: { theory: 0, workshop: 0, driving: 0 } }])),
    ).toEqual(['Horas: El curso debe tener al menos una hora.']);
  });

  it('rechaza categorías, canales y preguntas repetidos', () => {
    expect(issuesOf(() => mapPlans([plan, plan]))).toEqual(['Categorías repetidas: B1.']);
    const service = {
      category: 'A2',
      title: 'Motos',
      audience: 'Para motos.',
      summary: 'Motos.',
      vehicles: 'Motocicletas.',
      serviceType: 'private',
      minimumAge: 16,
      ageRequirement: 'Desde los 16 años',
    };
    expect(issuesOf(() => mapServices([service, service]))).toEqual(['Categorías repetidas: A2.']);
    const faq = {
      id: 'x',
      topic: 'courses',
      order: 1,
      question: '¿X?',
      answer: 'Y.',
      placements: [],
    };
    expect(issuesOf(() => mapFaqs([faq, faq]))).toEqual(['Preguntas repetidas: x.']);
  });

  it('exige el canal de WhatsApp y canales sin repetir', async () => {
    const contact = (await readJson('contact.json')) as { channels: { kind: string }[] };
    const withoutWhatsApp = {
      ...contact,
      channels: contact.channels.filter((c) => c.kind !== 'whatsapp'),
    };
    expect(issuesOf(() => mapContact(withoutWhatsApp))).toEqual([
      'Debe existir el canal de WhatsApp: es la acción principal del sitio.',
    ]);
    const repeated = { ...contact, channels: [...contact.channels, contact.channels[2]] };
    expect(issuesOf(() => mapContact(repeated))).toEqual(['Canales repetidos: email.']);
  });
});

describe('coherencia entre archivos', () => {
  const plans = mapPlans([plan]);

  it('detecta un plan sin servicio, un servicio sin plan y tipos distintos', () => {
    const problems = checkConsistency({
      plans,
      services: mapServices([
        {
          category: 'A2',
          title: 'Motos',
          audience: 'Para motos.',
          summary: 'Motos.',
          vehicles: 'Motocicletas.',
          serviceType: 'public',
          minimumAge: 16,
          ageRequirement: 'Desde los 16 años',
        },
      ]),
    });
    expect(problems.map((problem) => problem.message)).toEqual([
      'Falta el servicio de la categoría B1.',
      'Falta el plan de la categoría A2.',
    ]);
  });

  it('exige que la pregunta de horas mencione los totales reales', () => {
    const faqs = mapFaqs([
      {
        id: 'horas',
        topic: 'courses',
        order: 1,
        question: '¿Cuántas horas?',
        answer: 'B1 dura 48 horas.',
        placements: [],
      },
    ]);
    expect(checkConsistency({ plans, faqs })[0]?.message).toMatch(/debe decir "50 horas" para B1/u);
  });

  it('reporta un JSON mal escrito sin detener el resto de la validación', async () => {
    const problems = await validateContent(async (file) =>
      file === 'plans.json' ? '{ "roto": ' : readContent(file),
    );
    expect(problems).toHaveLength(1);
    expect(problems[0]?.file).toBe('plans.json');
  });
});

describe('Markdown de la política', () => {
  const markdown =
    '---\ntitle: Política\neffectiveDate: 2024-01-15\nstatus: approved\nanalyticsSection: included\n---\n\n<!-- nota interna -->\n\nIntro ignorada\n\n## 1. Primera\n\nTexto **uno**.\n\n## 2. Segunda\n\nTexto dos.\n';

  it('lee el encabezado y separa las secciones sin notas internas', () => {
    expect(parseFrontmatter(markdown).status).toBe('approved');
    expect(parseFrontmatter('sin encabezado')).toEqual({});
    expect(splitSections(stripFrontmatterAndComments(markdown))).toEqual([
      { title: '1. Primera', body: 'Texto **uno**.' },
      { title: '2. Segunda', body: 'Texto dos.' },
    ]);
  });

  it('genera anclas y rechaza un encabezado incompleto', () => {
    expect(mapDataPolicy(markdown).sections.map((section) => section.id)).toEqual([
      '1-primera',
      '2-segunda',
    ]);
    expect(issuesOf(() => mapDataPolicy('## Sin encabezado\n\nTexto'))).not.toHaveLength(0);
  });
});

describe('repositorios', () => {
  it('validan una sola vez y reutilizan el resultado', async () => {
    const repository = new StaticPlanRepository(await readJson('plans.json'));
    expect(await repository.list()).toBe(await repository.list());
  });

  it('fallan con el detalle del problema cuando el contenido no es válido', async () => {
    await expect(new StaticPlanRepository([{ ...plan, name: '' }]).list()).rejects.toThrow(
      /plans\.json/u,
    );
  });
});
