import { deepFreeze, findDuplicates, Issues, isNonEmpty } from '../shared/validation';
import { isValidNit } from './Nit';

/** Declaración institucional (misión o visión): título corto y texto literal. */
export interface Statement {
  readonly title: string;
  readonly text: string;
}

/** Diferenciador de la escuela (p. ej. "Instructores certificados"). */
export interface Differentiator {
  readonly id: string;
  readonly title: string;
  readonly description: string;
}

/** Datos de la empresa: identidad, NIT, misión, visión y diferenciadores. */
export interface CompanyInfo {
  /** Razón social registrada. */
  readonly legalName: string;
  /** Nombre comercial que se muestra en el sitio. */
  readonly brandName: string;
  readonly tagline: string;
  readonly nit: string;
  /** Presentación corta de la escuela (subtítulo de Nosotros). */
  readonly summary: string;
  readonly mission: Statement;
  readonly vision: Statement;
  readonly differentiators: readonly Differentiator[];
}

/**
 * Crea la información de la empresa validando sus reglas.
 *
 * @throws {InvalidContentError} Si falta un dato obligatorio o el NIT no es válido.
 */
export function createCompanyInfo(props: CompanyInfo): CompanyInfo {
  const issues = new Issues('CompanyInfo');
  issues.check(isNonEmpty(props.legalName), 'La razón social es obligatoria.');
  issues.check(isNonEmpty(props.brandName), 'El nombre comercial es obligatorio.');
  issues.check(
    isValidNit(props.nit),
    `El NIT "${props.nit}" no es válido (formato o dígito de verificación).`,
  );
  issues.check(isNonEmpty(props.mission.text), 'La misión es obligatoria.');
  issues.check(isNonEmpty(props.vision.text), 'La visión es obligatoria.');
  const duplicated = findDuplicates(props.differentiators.map((item) => item.id));
  issues.check(duplicated.length === 0, `Diferenciadores repetidos: ${duplicated.join(', ')}.`);
  issues.throwIfAny();
  return deepFreeze({ ...props });
}
