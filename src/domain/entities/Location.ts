import { deepFreeze, Issues, isHttpsUrl, isNonEmpty } from '../shared/validation';

export interface PostalAddress {
  /** Calle y número (p. ej. "Calle 13 # 10-96"). */
  readonly street: string;
  readonly city: string;
  /** Departamento (p. ej. "Córdoba"). */
  readonly region: string;
  readonly country: string;
}

export interface Coordinates {
  readonly latitude: number;
  readonly longitude: number;
}

/**
 * Ubicación de la sede. El enlace del perfil de Google, las coordenadas y el mapa
 * embebido son opcionales: si faltan, los enlaces se construyen con la dirección.
 */
export interface Location {
  readonly address: PostalAddress;
  /** Nombre del negocio en Google Maps (mejora la búsqueda del destino). */
  readonly businessName: string;
  readonly coordinates?: Coordinates | undefined;
  /** Enlace "Compartir" del Perfil de Empresa de Google. */
  readonly googleProfileUrl?: string | undefined;
  /** URL del iframe de Google Maps (se carga solo al pulsar "Ver mapa"). */
  readonly embedUrl?: string | undefined;
}

/** @throws {InvalidContentError} Si la dirección está incompleta o un enlace no es válido. */
export function createLocation(props: Location): Location {
  const issues = new Issues('Location');
  const { address } = props;
  const fields: readonly (readonly [string, string])[] = [
    ['calle y número', address.street],
    ['ciudad', address.city],
    ['departamento', address.region],
    ['país', address.country],
  ];
  for (const [field, value] of fields) {
    issues.check(isNonEmpty(value), `La dirección necesita ${field}.`);
  }
  issues.check(isNonEmpty(props.businessName), 'El nombre del negocio es obligatorio.');
  if (props.coordinates !== undefined) {
    const { latitude, longitude } = props.coordinates;
    issues.check(Math.abs(latitude) <= 90, 'La latitud debe estar entre -90 y 90.');
    issues.check(Math.abs(longitude) <= 180, 'La longitud debe estar entre -180 y 180.');
  }
  if (props.googleProfileUrl !== undefined) {
    issues.check(isHttpsUrl(props.googleProfileUrl), 'El enlace del perfil debe ser https.');
  }
  if (props.embedUrl !== undefined) {
    issues.check(
      isHttpsUrl(props.embedUrl) && new URL(props.embedUrl).hostname.endsWith('google.com'),
      'El mapa embebido debe ser una URL https de Google Maps.',
    );
  }
  issues.throwIfAny();
  return deepFreeze({ ...props });
}

/** Dirección en una línea (p. ej. "Calle 13 # 10-96, Cereté, Córdoba, Colombia"). */
export function formatAddress(address: PostalAddress, includeCountry = true): string {
  const parts = [address.street, address.city, address.region];
  return (includeCountry ? [...parts, address.country] : parts).join(', ');
}
