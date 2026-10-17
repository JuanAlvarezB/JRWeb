import type { CompanyInfo } from '@/domain/entities/CompanyInfo';
import { primaryEntry, SOCIAL_KINDS, type ContactChannel } from '@/domain/entities/ContactChannel';
import type { Faq } from '@/domain/entities/Faq';
import type { Location } from '@/domain/entities/Location';
import type { Plan } from '@/domain/entities/Plan';
import { CANONICAL_ORIGIN } from '@/shared/constants/site';
import { UI_TEXT } from '@/shared/constants/uiText';
import { OG_IMAGE } from './pageMeta';

/** Objeto JSON-LD (schema.org). */
export type JsonLd = Readonly<Record<string, unknown>>;

/** Contenido que alimenta los datos estructurados de la escuela. */
export interface SchoolData {
  readonly company: CompanyInfo;
  readonly location: Location;
  readonly channels: readonly ContactChannel[];
  readonly plans: readonly Plan[];
}

/** Códigos ISO 3166-1 de los países que pueden aparecer en la dirección. */
const COUNTRY_CODES: Readonly<Record<string, string>> = { Colombia: 'CO' };

/** Identificador estable de la escuela en el grafo de datos estructurados. */
export const SCHOOL_ID = `${CANONICAL_ORIGIN}/#escuela`;

/**
 * La escuela como `DrivingSchool` (subtipo de `LocalBusiness`): nombre, NIT,
 * dirección, coordenadas, contacto, redes y cursos. Sin calificación: Google no
 * acepta opiniones del propio negocio en sus datos estructurados, y sin precios.
 */
export function drivingSchoolJsonLd({ company, location, channels, plans }: SchoolData): JsonLd {
  const phone = primaryEntry(channels, 'phone') ?? primaryEntry(channels, 'whatsapp');
  const email = primaryEntry(channels, 'email');
  const social = channels
    .filter((channel) => SOCIAL_KINDS.includes(channel.kind))
    .flatMap((channel) => channel.entries.map((entry) => entry.value));
  const { address, coordinates, googleProfileUrl } = location;

  return {
    '@context': 'https://schema.org',
    '@type': 'DrivingSchool',
    '@id': SCHOOL_ID,
    name: company.brandName,
    legalName: company.legalName,
    alternateName: location.businessName,
    description: company.summary,
    slogan: company.tagline,
    taxID: company.nit,
    url: `${CANONICAL_ORIGIN}/`,
    logo: `${CANONICAL_ORIGIN}/icon-512.png`,
    image: OG_IMAGE.url,
    ...(phone === undefined ? {} : { telephone: phone.value }),
    ...(email === undefined ? {} : { email: email.value }),
    address: {
      '@type': 'PostalAddress',
      streetAddress: address.street,
      addressLocality: address.city,
      addressRegion: address.region,
      addressCountry: COUNTRY_CODES[address.country] ?? address.country,
    },
    ...(coordinates === undefined
      ? {}
      : {
          geo: {
            '@type': 'GeoCoordinates',
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
          },
        }),
    ...(googleProfileUrl === undefined ? {} : { hasMap: googleProfileUrl }),
    areaServed: address.city,
    sameAs: googleProfileUrl === undefined ? social : [...social, googleProfileUrl],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: UI_TEXT.seo.coursesCatalog,
      itemListElement: plans.map((plan) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Course',
          name: plan.name,
          description: plan.description,
          provider: { '@id': SCHOOL_ID },
        },
      })),
    },
  };
}

/** Preguntas frecuentes como `FAQPage` (solo la página de Preguntas frecuentes). */
export function faqPageJsonLd(faqs: readonly Faq[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };
}
