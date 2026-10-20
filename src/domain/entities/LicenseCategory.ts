/** Categorías de licencia que ofrece la escuela, en el orden en que se muestran. */
export const LICENSE_CATEGORIES = ['A2', 'B1', 'C1'] as const;

export type LicenseCategory = (typeof LICENSE_CATEGORIES)[number];

export function isLicenseCategory(value: string): value is LicenseCategory {
  return (LICENSE_CATEGORIES as readonly string[]).includes(value);
}

/** Tipo de servicio del vehículo según la licencia. */
export type ServiceType = 'private' | 'public';

/** Ordena cualquier lista por categoría (A2, B1, C1) sin modificar la original. */
export function sortByCategory<T extends { readonly category: LicenseCategory }>(
  items: readonly T[],
): T[] {
  return [...items].sort(
    (a, b) => LICENSE_CATEGORIES.indexOf(a.category) - LICENSE_CATEGORIES.indexOf(b.category),
  );
}
