import {
  deepFreeze,
  Issues,
  isHttpsUrl,
  isIsoDate,
  isNonEmpty,
  isNonNegativeInteger,
} from '../shared/validation';

/**
 * Opinión real publicada en Google. Nunca se inventan opiniones.
 * Si no se conoce la fecha de publicación, se muestra la fecha en que se consultó.
 */
export interface Testimonial {
  readonly id: string;
  readonly quote: string;
  /** Nombre como aparece en Google (p. ej. "Cruz P."); vacío si es anónima. */
  readonly author?: string | undefined;
  readonly source: 'google';
  readonly publishedAt?: string | undefined;
  /** Fecha en que se tomó la opinión de Google (AAAA-MM-DD). */
  readonly retrievedAt: string;
}

/** Calificación en Google en una fecha de corte. Solo se muestra; no va en JSON-LD. */
export interface RatingSummary {
  readonly score: number;
  readonly reviewCount: number;
  readonly asOf: string;
  readonly reviewsUrl: string;
}

/** @throws {InvalidContentError} Si falta la cita o las fechas no son válidas. */
export function createTestimonial(props: Testimonial): Testimonial {
  const issues = new Issues(`Testimonial ${props.id}`);
  issues.check(isNonEmpty(props.quote), 'La cita es obligatoria.');
  issues.check(isIsoDate(props.retrievedAt), 'La fecha de consulta debe ser AAAA-MM-DD.');
  if (props.publishedAt !== undefined) {
    issues.check(isIsoDate(props.publishedAt), 'La fecha de publicación debe ser AAAA-MM-DD.');
    issues.check(
      props.publishedAt <= props.retrievedAt,
      'No puede publicarse después de consultarse.',
    );
  }
  issues.throwIfAny();
  return deepFreeze({ ...props });
}

/** @throws {InvalidContentError} Si la calificación está fuera de 0–5 o faltan datos. */
export function createRatingSummary(props: RatingSummary): RatingSummary {
  const issues = new Issues('RatingSummary');
  issues.check(props.score >= 0 && props.score <= 5, 'La calificación debe estar entre 0 y 5.');
  issues.check(
    isNonNegativeInteger(props.reviewCount),
    'El número de opiniones debe ser un entero ≥ 0.',
  );
  issues.check(isIsoDate(props.asOf), 'La fecha del dato debe ser AAAA-MM-DD.');
  issues.check(isHttpsUrl(props.reviewsUrl), 'El enlace a las opiniones debe ser https.');
  issues.throwIfAny();
  return deepFreeze({ ...props });
}
