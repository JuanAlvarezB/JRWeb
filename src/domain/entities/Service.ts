import {
  deepFreeze,
  Issues,
  isNonEmpty,
  isNonNegativeInteger,
  isSitePath,
} from '../shared/validation';
import type { LicenseCategory, ServiceType } from './LicenseCategory';

/** Foto real opcional (4:3). Sin foto, el bloque se muestra en una columna. */
export interface Photo {
  readonly src: string;
  readonly alt: string;
}

/** Servicio: curso para una categoría de licencia (página Servicios). */
export interface Service {
  readonly category: LicenseCategory;
  /** Título del bloque (p. ej. "Motocicletas"). */
  readonly title: string;
  /** Para quién es el curso. */
  readonly audience: string;
  /** Vehículos que cubre la licencia. */
  readonly vehicles: string;
  readonly serviceType: ServiceType;
  /** Edad mínima en años, para reglas y datos estructurados. */
  readonly minimumAge: number;
  /** Texto de la edad tal como se publica (p. ej. "Desde los 16 años"). */
  readonly ageRequirement: string;
  readonly photo?: Photo | undefined;
}

/** @throws {InvalidContentError} Si falta un dato o la foto no es válida. */
export function createService(props: Service): Service {
  const issues = new Issues(`Service ${props.category}`);
  issues.check(isNonEmpty(props.title), 'El título es obligatorio.');
  issues.check(isNonEmpty(props.audience), 'El público del curso es obligatorio.');
  issues.check(isNonEmpty(props.vehicles), 'Los vehículos son obligatorios.');
  issues.check(
    isNonNegativeInteger(props.minimumAge) && props.minimumAge > 0,
    'La edad mínima debe ser un entero positivo.',
  );
  issues.check(isNonEmpty(props.ageRequirement), 'El texto de la edad es obligatorio.');
  if (props.photo !== undefined) {
    issues.check(
      isSitePath(props.photo.src),
      'La foto debe ser una ruta del sitio (p. ej. /assets/…).',
    );
    issues.check(isNonEmpty(props.photo.alt), 'La foto necesita un texto alternativo.');
  }
  issues.throwIfAny();
  return deepFreeze({ ...props });
}
