/**
 * Datos de ejemplo válidos para las pruebas del dominio, tomados del contenido real
 * de los mockups aprobados.
 */
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

export const company: CompanyInfo = {
  legalName: 'CENTRO DE ENSEÑANZA AUTOMOVILÍSTICA CONDUCIR J & R DEL SINÚ S.A.S.',
  brandName: 'Conducir J&R del Sinú',
  tagline: 'Centro de Enseñanza Automovilística',
  nit: '901722359-5',
  summary: 'Somos un Centro de Enseñanza Automovilística en Cereté, Córdoba.',
  mission: {
    title: 'Formar conductores que respeten la seguridad vial',
    text: 'Formar conductores…',
  },
  vision: { title: 'Un referente local en 2028', text: 'Nuestro propósito es…' },
  differentiators: [
    {
      id: 'instructores',
      title: 'Instructores certificados',
      description: 'Aprendes con instructores certificados.',
    },
    { id: 'horarios', title: 'Horarios flexibles', description: 'Clases de día o de noche.' },
  ],
};

export const plans: readonly Plan[] = [
  {
    category: 'C1',
    name: 'Licencia C1',
    description: 'Automóviles, camperos, camionetas y microbuses de servicio público.',
    serviceType: 'public',
    ageRequirement: 'Mayores de 18 años',
    hours: { theory: 30, workshop: 5, driving: 30 },
  },
  {
    category: 'A2',
    name: 'Licencia A2',
    description: 'Motocicletas, motociclos y mototriciclos con cilindrada mayor a 125 cc.',
    serviceType: 'private',
    ageRequirement: 'Desde 16 años',
    hours: { theory: 25, workshop: 3, driving: 15 },
  },
  {
    category: 'B1',
    name: 'Licencia B1',
    description:
      'Automóviles, motocarros, cuatrimotos, camperos, camionetas y microbuses de servicio particular.',
    serviceType: 'private',
    ageRequirement: 'Desde 16 años',
    hours: { theory: 25, workshop: 5, driving: 20 },
  },
];

export const services: readonly Service[] = [
  {
    category: 'B1',
    title: 'Vehículos de servicio particular',
    audience: 'Para quienes van a conducir carro, camioneta o microbús de uso particular.',
    summary: 'Automóviles, camionetas y otros vehículos de servicio particular.',
    vehicles: 'Automóviles, motocarros, cuatrimotos, camperos, camionetas y microbuses.',
    serviceType: 'private',
    minimumAge: 16,
    ageRequirement: 'Desde los 16 años',
  },
  {
    category: 'A2',
    title: 'Motocicletas',
    audience: 'Para quienes van a conducir moto de alto cilindraje en servicio particular.',
    summary: 'Motocicletas, motociclos y mototriciclos de más de 125 cc.',
    vehicles: 'Motocicletas, motociclos y mototriciclos con cilindrada mayor a 125 cc.',
    serviceType: 'private',
    minimumAge: 16,
    ageRequirement: 'Desde los 16 años',
  },
];

export const location: Location = {
  address: { street: 'Calle 13 # 10-96', city: 'Cereté', region: 'Córdoba', country: 'Colombia' },
  businessName: 'CEA Conducir J&R del Sinú - Centro de Enseñanza Automovilística',
  coordinates: { latitude: 8.8877998, longitude: -75.7887601 },
  googleProfileUrl: 'https://maps.app.goo.gl/Zko5WSsCAiaZyExX7',
  embedUrl: 'https://www.google.com/maps/embed?pb=!1m18',
};

export const channels: readonly ContactChannel[] = [
  {
    kind: 'whatsapp',
    label: 'WhatsApp',
    entries: [
      { value: '+573165641048', display: '+57 316 564 1048' },
      { value: '+573246525153', display: '+57 324 652 5153' },
    ],
  },
  {
    kind: 'email',
    label: 'Correo',
    entries: [{ value: 'conducirdelsinu@gmail.com', display: 'conducirdelsinu@gmail.com' }],
  },
  {
    kind: 'instagram',
    label: 'Instagram',
    entries: [
      {
        value: 'https://www.instagram.com/ceaconducirjrdelsinu/',
        display: '@ceaconducirjrdelsinu',
      },
    ],
  },
];

export const whatsAppMessages: WhatsAppMessages = {
  general: 'Hola, vi la página web y quiero información sobre los cursos.',
  priceInquiry: 'Hola, vi en la página web el curso {categoria} y quiero conocer el precio.',
  requirementsInquiry:
    'Hola, vi en la página web el curso {categoria} y quiero conocer los requisitos.',
};

export const schedule: ClassSchedule = {
  blocks: [
    {
      id: 'theory-day',
      kind: 'theory',
      days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      slots: [
        { start: '08:00', end: '10:00' },
        { start: '10:00', end: '12:00' },
        { start: '14:00', end: '16:00' },
        { start: '16:00', end: '18:00' },
      ],
    },
    {
      id: 'theory-night',
      kind: 'theory',
      days: ['monday', 'tuesday', 'wednesday'],
      slots: [{ start: '18:00', end: '20:00' }],
    },
    {
      id: 'practice',
      kind: 'practice',
      days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
      slots: [],
      note: 'Escríbenos para coordinar tus clases de manejo.',
    },
  ],
};

export const faqs: readonly Faq[] = [
  {
    id: 'precio',
    topic: 'pricing',
    question: '¿Cuánto cuesta el curso?',
    answer: 'Escríbenos por WhatsApp y te enviamos el precio y las promociones vigentes.',
    action: { kind: 'whatsapp', label: 'Escríbenos por WhatsApp' },
    placements: [{ page: 'plans', order: 3 }],
    order: 2,
  },
  {
    id: 'edad',
    topic: 'courses',
    question: '¿Desde qué edad puedo hacer el curso?',
    answer: 'A2 y B1 desde los 16 años. C1 para mayores de 18 años.',
    placements: [{ page: 'plans', order: 1 }],
    order: 1,
  },
  {
    id: 'ubicacion',
    topic: 'location',
    question: '¿Dónde están ubicados?',
    answer: 'En la Calle 13 # 10-96, Cereté, Córdoba.',
    action: { kind: 'directions', label: 'Cómo llegar' },
    placements: [],
    order: 1,
  },
  {
    id: 'requisitos',
    topic: 'pricing',
    question: '¿Qué requisitos necesito?',
    answer: 'Escríbenos por WhatsApp y te contamos los requisitos de tu categoría.',
    placements: [{ page: 'plans', order: 4 }],
    order: 1,
  },
];

export const testimonials: readonly Testimonial[] = [
  {
    id: 'excelente',
    quote: 'Excelente servicio, calidad en sus procesos.',
    source: 'google',
    retrievedAt: '2026-10-14',
  },
  {
    id: 'cruz',
    quote: 'Trámites rápidos y lo más importante, legal.',
    author: 'Cruz P.',
    source: 'google',
    retrievedAt: '2026-10-14',
  },
];

export const rating: RatingSummary = {
  score: 5,
  reviewCount: 5,
  asOf: '2026-10-14',
  reviewsUrl: 'https://maps.app.goo.gl/Zko5WSsCAiaZyExX7',
};

export const dataPolicy: LegalDocument = {
  title: 'Política de Tratamiento de Datos Personales',
  effectiveDate: '2024-01-15',
  status: 'approved',
  sections: [
    { id: '1-marco-normativo', title: '1.MARCO NORMATIVO', body: 'En cumplimiento de…' },
    { id: 'analitica-del-sitio-web', title: 'ANALÍTICA DEL SITIO WEB', body: 'El sitio web…' },
  ],
};

/** Elemento de una lista de ejemplo; falla con un mensaje claro si no existe. */
export function at<T>(items: readonly T[], index: number): T {
  const item = items[index];
  if (item === undefined) throw new Error(`No hay elemento en la posición ${String(index)}.`);
  return item;
}
