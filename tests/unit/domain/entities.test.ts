import { describe, expect, it } from 'vitest';
import { createClassSchedule, findBlock } from '@/domain/entities/ClassSchedule';
import { createCompanyInfo } from '@/domain/entities/CompanyInfo';
import { createContactChannel, primaryEntry } from '@/domain/entities/ContactChannel';
import { createCourseHours, hourShares, totalHours } from '@/domain/entities/CourseHours';
import { createFaq, groupFaqsByTopic } from '@/domain/entities/Faq';
import { createLegalDocument, isPublishable } from '@/domain/entities/LegalDocument';
import { isLicenseCategory, sortByCategory } from '@/domain/entities/LicenseCategory';
import { createLocation, formatAddress } from '@/domain/entities/Location';
import { computeNitCheckDigit, isValidNit } from '@/domain/entities/Nit';
import { createPlan, type Plan } from '@/domain/entities/Plan';
import { createService } from '@/domain/entities/Service';
import { createRatingSummary, createTestimonial } from '@/domain/entities/Testimonial';
import { createWhatsAppMessages, renderInquiry } from '@/domain/entities/WhatsAppMessages';
import { InvalidContentError } from '@/domain/errors/InvalidContentError';
import {
  at,
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

/** Ejecuta la fábrica y devuelve la lista de problemas (vacía si es válida). */
function issuesOf(run: () => unknown): readonly string[] {
  try {
    run();
    return [];
  } catch (error) {
    if (error instanceof InvalidContentError) return error.issues;
    throw error;
  }
}

describe('NIT', () => {
  it('valida el NIT real de la escuela con el dígito de la DIAN', () => {
    expect(computeNitCheckDigit('901722359')).toBe(5);
    expect(isValidNit('901722359-5')).toBe(true);
  });

  it.each(['901722359-4', '901722359', '90172235-5', 'NIT 901722359-5'])('rechaza "%s"', (nit) => {
    expect(isValidNit(nit)).toBe(false);
  });

  it('usa el residuo como dígito cuando es 0 o 1', () => {
    // 1·3 = 3 → 3 mod 11 = 3 → 11 − 3 = 8; 4·3 = 12 → 12 mod 11 = 1 → dígito 1
    expect(computeNitCheckDigit('1')).toBe(8);
    expect(computeNitCheckDigit('4')).toBe(1);
  });
});

describe('CompanyInfo', () => {
  it('acepta los datos reales y los congela', () => {
    const info = createCompanyInfo(company);
    expect(info.nit).toBe('901722359-5');
    expect(Object.isFrozen(info.mission)).toBe(true);
  });

  it('reporta todos los problemas juntos', () => {
    const issues = issuesOf(() =>
      createCompanyInfo({
        ...company,
        nit: '901722359-0',
        legalName: ' ',
        differentiators: [at(company.differentiators, 0), at(company.differentiators, 0)],
      }),
    );
    expect(issues).toHaveLength(3);
    expect(issues.join(' ')).toMatch(/NIT/);
  });
});

describe('CourseHours y Plan', () => {
  it('suma el total y calcula proporciones que suman 1', () => {
    const hours = createCourseHours({ theory: 25, workshop: 5, driving: 20 });
    expect(totalHours(hours)).toBe(50);
    const shares = hourShares(hours);
    expect(shares.theory).toBe(0.5);
    expect(shares.theory + shares.workshop + shares.driving).toBeCloseTo(1);
  });

  it('rechaza horas negativas, decimales o un total de cero', () => {
    expect(
      issuesOf(() => createCourseHours({ theory: -1, workshop: 2.5, driving: 0 })),
    ).toHaveLength(2);
    expect(issuesOf(() => createCourseHours({ theory: 0, workshop: 0, driving: 0 }))).toEqual([
      'El curso debe tener al menos una hora.',
    ]);
  });

  it('crea un plan válido e incluye los problemas de sus horas', () => {
    expect(createPlan(at(plans, 2)).hours.driving).toBe(20);
    const issues = issuesOf(() =>
      createPlan({ ...at(plans, 0), name: '', hours: { theory: 0, workshop: 0, driving: 0 } }),
    );
    expect(issues).toContain('El nombre es obligatorio.');
    expect(issues).toContain('Horas: El curso debe tener al menos una hora.');
  });

  it('nunca acepta un precio publicado', () => {
    const withPrice = { ...at(plans, 0), price: 850000 } as Plan;
    expect(issuesOf(() => createPlan(withPrice))).toContain(
      'Un plan no puede tener precio publicado.',
    );
  });
});

describe('Service', () => {
  it('acepta un servicio sin foto (se muestra en una columna)', () => {
    expect(createService(at(services, 0)).photo).toBeUndefined();
  });

  it('exige ruta del sitio y texto alternativo en la foto', () => {
    const issues = issuesOf(() =>
      createService({
        ...at(services, 0),
        minimumAge: 0,
        photo: { src: 'https://stock.com/x.jpg', alt: '' },
      }),
    );
    expect(issues).toHaveLength(3);
  });
});

describe('LicenseCategory', () => {
  it('ordena A2, B1, C1 sin modificar la lista original', () => {
    expect(sortByCategory(plans).map((plan) => plan.category)).toEqual(['A2', 'B1', 'C1']);
    expect(plans[0]?.category).toBe('C1');
  });

  it('reconoce solo las categorías ofrecidas', () => {
    expect(isLicenseCategory('B1')).toBe(true);
    expect(isLicenseCategory('B2')).toBe(false);
  });
});

describe('Location', () => {
  it('acepta la ubicación real y formatea la dirección', () => {
    const value = createLocation(location);
    expect(formatAddress(value.address)).toBe('Calle 13 # 10-96, Cereté, Córdoba, Colombia');
    expect(formatAddress(value.address, false)).toBe('Calle 13 # 10-96, Cereté, Córdoba');
  });

  it('acepta una ubicación solo con dirección (enlaces opcionales)', () => {
    const { address, businessName } = location;
    expect(createLocation({ address, businessName }).coordinates).toBeUndefined();
  });

  it('rechaza coordenadas fuera de rango y enlaces no válidos', () => {
    const issues = issuesOf(() =>
      createLocation({
        ...location,
        address: { ...location.address, city: '' },
        coordinates: { latitude: 95, longitude: -200 },
        googleProfileUrl: 'http://maps.google.com',
        embedUrl: 'https://otro-sitio.com/mapa',
      }),
    );
    expect(issues).toHaveLength(5);
  });
});

describe('ContactChannel', () => {
  it('acepta celulares colombianos, correo y perfiles de redes', () => {
    for (const channel of channels) expect(createContactChannel(channel).kind).toBe(channel.kind);
    expect(primaryEntry(channels, 'whatsapp')?.value).toBe('+573165641048');
    expect(primaryEntry(channels, 'tiktok')).toBeUndefined();
  });

  it('rechaza un teléfono fijo, un correo mal escrito y una red con otro dominio', () => {
    expect(
      issuesOf(() =>
        createContactChannel({
          kind: 'phone',
          label: 'Fijo',
          entries: [{ value: '+5747745566', display: '774 5566' }],
        }),
      ),
    ).toHaveLength(1);
    expect(
      issuesOf(() =>
        createContactChannel({
          kind: 'email',
          label: 'Correo',
          entries: [{ value: 'correo@', display: '' }],
        }),
      ),
    ).toHaveLength(2);
    expect(
      issuesOf(() =>
        createContactChannel({
          kind: 'facebook',
          label: 'Facebook',
          entries: [{ value: 'https://instagram.com/x', display: 'x' }],
        }),
      ),
    ).toHaveLength(1);
    expect(
      issuesOf(() => createContactChannel({ kind: 'tiktok', label: '', entries: [] })),
    ).toHaveLength(2);
  });
});

describe('WhatsAppMessages', () => {
  it('reemplaza la categoría en las plantillas', () => {
    const messages = createWhatsAppMessages(whatsAppMessages);
    expect(renderInquiry(messages.priceInquiry, 'B1')).toBe(
      'Hola, vi en la página web el curso B1 y quiero conocer el precio.',
    );
  });

  it('exige el marcador {categoria} en precio y requisitos', () => {
    const issues = issuesOf(() =>
      createWhatsAppMessages({ general: '', priceInquiry: 'Hola', requirementsInquiry: 'Hola' }),
    );
    expect(issues).toHaveLength(3);
  });
});

describe('ClassSchedule', () => {
  it('acepta los horarios reales (prácticas sin franjas, con nota)', () => {
    const value = createClassSchedule(schedule);
    expect(findBlock(value, 'theory-night')?.slots[0]).toEqual({ start: '18:00', end: '20:00' });
    expect(findBlock(value, 'practice')?.note).toMatch(/coordinar/);
  });

  it('rechaza horas no válidas, franjas cruzadas y días desordenados', () => {
    const issues = issuesOf(() =>
      createClassSchedule({
        blocks: [
          {
            id: 'theory-day',
            kind: 'theory',
            days: ['friday', 'monday'],
            slots: [
              { start: '10:00', end: '12:00' },
              { start: '11:00', end: '09:00' },
              { start: '25:00', end: '26:00' },
            ],
          },
          { id: 'practice', kind: 'practice', days: [], slots: [] },
        ],
      }),
    );
    expect(issues.join('\n')).toMatch(/orden de la semana/);
    expect(issues.join('\n')).toMatch(/11:00 debe ser antes de 09:00/);
    expect(issues.join('\n')).toMatch(/hora no válida/);
    expect(issues.join('\n')).toMatch(/necesita una nota/);
  });

  it('rechaza bloques repetidos y un horario vacío', () => {
    expect(issuesOf(() => createClassSchedule({ blocks: [] }))).toHaveLength(1);
    const block = at(schedule.blocks, 1);
    expect(issuesOf(() => createClassSchedule({ blocks: [block, block] }))).toEqual([
      'Bloques repetidos: theory-night.',
    ]);
  });
});

describe('Faq', () => {
  it('agrupa por tema en orden canónico y ordena dentro de cada tema', () => {
    const groups = groupFaqsByTopic(faqs.map(createFaq));
    expect(groups.map((group) => group.topic)).toEqual(['courses', 'pricing', 'location']);
    expect(groups[1]?.faqs.map((faq) => faq.id)).toEqual(['requisitos', 'precio']);
  });

  it('exige formato de pregunta, respuesta y texto de la acción', () => {
    const issues = issuesOf(() =>
      createFaq({
        ...at(faqs, 0),
        id: 'Precio Curso',
        question: 'Cuánto cuesta',
        answer: '',
        action: { kind: 'whatsapp', label: '' },
      }),
    );
    expect(issues).toHaveLength(4);
  });
});

describe('Testimonial y RatingSummary', () => {
  it('acepta opiniones reales con y sin autor', () => {
    expect(testimonials.map(createTestimonial).map((item) => item.author)).toEqual([
      undefined,
      'Cruz P.',
    ]);
    expect(createRatingSummary(rating).score).toBe(5);
  });

  it('rechaza fechas no válidas o una publicación posterior a la consulta', () => {
    const issues = issuesOf(() =>
      createTestimonial({
        ...at(testimonials, 0),
        quote: '',
        retrievedAt: '2026-02-30',
        publishedAt: '2027-01-01',
      }),
    );
    expect(issues).toHaveLength(3);
    expect(
      issuesOf(() =>
        createRatingSummary({
          score: 6,
          reviewCount: 1.5,
          asOf: '14/10/2026',
          reviewsUrl: 'google',
        }),
      ),
    ).toHaveLength(4);
  });
});

describe('LegalDocument', () => {
  it('solo se publica si está aprobado', () => {
    expect(isPublishable(createLegalDocument(dataPolicy))).toBe(true);
    expect(isPublishable({ ...dataPolicy, status: 'draft' })).toBe(false);
  });

  it('rechaza anclas repetidas, secciones vacías y fecha no válida', () => {
    const section = { id: 'a', title: 'A', body: '' };
    const issues = issuesOf(() =>
      createLegalDocument({
        ...dataPolicy,
        effectiveDate: '15/01/2024',
        sections: [section, section],
      }),
    );
    expect(issues).toHaveLength(4);
    expect(
      issuesOf(() => createLegalDocument({ ...dataPolicy, title: '', sections: [] })),
    ).toHaveLength(2);
  });
});
