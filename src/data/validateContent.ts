/**
 * Validación de todo el contenido publicado: esquema Zod + reglas del dominio de cada
 * archivo y coherencia entre archivos. La usan el CI (`npm run content:validate`) y
 * las pruebas. No depende del navegador ni de Vite.
 */
import { totalHours } from '../domain/entities/CourseHours';
import type { Faq } from '../domain/entities/Faq';
import type { Location } from '../domain/entities/Location';
import type { Plan } from '../domain/entities/Plan';
import type { Service } from '../domain/entities/Service';
import { DomainError } from '../domain/errors/DomainError';
import { InvalidContentError } from '../domain/errors/InvalidContentError';
import { mapCompany } from './mappers/companyMapper';
import { mapContact } from './mappers/contactMapper';
import { DATA_POLICY_FILE, mapDataPolicy } from './mappers/dataPolicyMapper';
import { mapFaqs } from './mappers/faqMapper';
import { mapLocation } from './mappers/locationMapper';
import { mapPlans } from './mappers/plansMapper';
import { mapSchedule } from './mappers/scheduleMapper';
import { mapServices } from './mappers/servicesMapper';
import { mapTestimonials, type TestimonialsContent } from './mappers/testimonialsMapper';

/** Archivos de `src/data/content/` que se validan. */
export const CONTENT_FILES = {
  company: 'company.json',
  services: 'services.json',
  plans: 'plans.json',
  location: 'location.json',
  contact: 'contact.json',
  schedule: 'schedule.json',
  faq: 'faq.json',
  testimonials: 'testimonials.json',
  dataPolicy: DATA_POLICY_FILE,
} as const;

/** Pregunta frecuente cuyo texto debe coincidir con las horas de `plans.json`. */
export const HOURS_FAQ_ID = 'horas';

/** Un problema de contenido, con el archivo donde corregirlo. */
export interface ContentProblem {
  readonly file: string;
  readonly message: string;
}

type ReadFile = (file: string) => Promise<string>;

function toProblems(file: string, error: unknown): ContentProblem[] {
  if (error instanceof InvalidContentError) {
    const prefix = error.entity === file ? '' : `${error.entity}: `;
    return error.issues.map((message) => ({ file, message: `${prefix}${message}` }));
  }
  if (error instanceof DomainError || error instanceof SyntaxError) {
    return [{ file, message: error.message }];
  }
  throw error;
}

async function readJson(read: ReadFile, file: string): Promise<unknown> {
  return JSON.parse(await read(file)) as unknown;
}

/** Coherencia entre planes, servicios, preguntas y ubicación. */
export function checkConsistency(content: {
  readonly plans?: readonly Plan[];
  readonly services?: readonly Service[];
  readonly faqs?: readonly Faq[];
  readonly location?: Location;
  readonly testimonials?: TestimonialsContent;
}): ContentProblem[] {
  const problems: ContentProblem[] = [];
  const { plans, services, faqs, location, testimonials } = content;

  if (plans !== undefined && services !== undefined) {
    for (const plan of plans) {
      const service = services.find((item) => item.category === plan.category);
      if (service === undefined) {
        problems.push({
          file: CONTENT_FILES.services,
          message: `Falta el servicio de la categoría ${plan.category}.`,
        });
      } else if (service.serviceType !== plan.serviceType) {
        problems.push({
          file: CONTENT_FILES.plans,
          message: `${plan.category}: el tipo de servicio no coincide con services.json.`,
        });
      }
    }
    for (const service of services) {
      if (!plans.some((plan) => plan.category === service.category)) {
        problems.push({
          file: CONTENT_FILES.plans,
          message: `Falta el plan de la categoría ${service.category}.`,
        });
      }
    }
  }

  const hoursFaq = faqs?.find((faq) => faq.id === HOURS_FAQ_ID);
  if (plans !== undefined && hoursFaq !== undefined) {
    for (const plan of plans) {
      const expected = `${String(totalHours(plan.hours))} horas`;
      if (!hoursFaq.answer.includes(expected)) {
        problems.push({
          file: CONTENT_FILES.faq,
          message: `La respuesta "${hoursFaq.question}" debe decir "${expected}" para ${plan.category} (plans.json).`,
        });
      }
    }
  }

  if (location?.googleProfileUrl !== undefined && testimonials !== undefined) {
    if (testimonials.rating.reviewsUrl !== location.googleProfileUrl) {
      problems.push({
        file: CONTENT_FILES.testimonials,
        message: 'El enlace de las opiniones debe ser el mismo perfil de Google de location.json.',
      });
    }
  }
  return problems;
}

/**
 * Valida todos los archivos de contenido.
 *
 * @param read - Lee un archivo relativo a `src/data/content/`.
 * @returns La lista de problemas (vacía si todo está bien).
 */
export async function validateContent(read: ReadFile): Promise<ContentProblem[]> {
  const problems: ContentProblem[] = [];
  async function attempt<T>(file: string, map: () => Promise<T>): Promise<T | undefined> {
    try {
      return await map();
    } catch (error) {
      problems.push(...toProblems(file, error));
      return undefined;
    }
  }

  const { company, services, plans, location, contact, schedule, faq, testimonials, dataPolicy } =
    CONTENT_FILES;
  await attempt(company, async () => mapCompany(await readJson(read, company)));
  const mappedServices = await attempt(services, async () =>
    mapServices(await readJson(read, services)),
  );
  const mappedPlans = await attempt(plans, async () => mapPlans(await readJson(read, plans)));
  const mappedLocation = await attempt(location, async () =>
    mapLocation(await readJson(read, location)),
  );
  await attempt(contact, async () => mapContact(await readJson(read, contact)));
  await attempt(schedule, async () => mapSchedule(await readJson(read, schedule)));
  const mappedFaqs = await attempt(faq, async () => mapFaqs(await readJson(read, faq)));
  const mappedTestimonials = await attempt(testimonials, async () =>
    mapTestimonials(await readJson(read, testimonials)),
  );
  await attempt(dataPolicy, async () => mapDataPolicy(await read(dataPolicy)));

  problems.push(
    ...checkConsistency({
      ...(mappedPlans === undefined ? {} : { plans: mappedPlans }),
      ...(mappedServices === undefined ? {} : { services: mappedServices }),
      ...(mappedFaqs === undefined ? {} : { faqs: mappedFaqs }),
      ...(mappedLocation === undefined ? {} : { location: mappedLocation }),
      ...(mappedTestimonials === undefined ? {} : { testimonials: mappedTestimonials }),
    }),
  );
  return problems;
}
