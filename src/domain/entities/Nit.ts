/** Pesos de la DIAN para el dígito de verificación, de derecha a izquierda. */
const DIAN_WEIGHTS = [3, 7, 13, 17, 19, 23, 29, 37, 41, 43, 47, 53, 59, 67, 71] as const;
const MODULUS = 11;

/**
 * Calcula el dígito de verificación de un NIT colombiano (algoritmo de la DIAN).
 *
 * @param base - NIT sin dígito de verificación (solo números).
 */
export function computeNitCheckDigit(base: string): number {
  let sum = 0;
  for (let index = 0; index < base.length; index += 1) {
    const digit = Number(base.charAt(base.length - 1 - index));
    sum += digit * (DIAN_WEIGHTS[index] ?? 0);
  }
  const remainder = sum % MODULUS;
  return remainder > 1 ? MODULUS - remainder : remainder;
}

/** `true` si el NIT tiene el formato `123456789-0` y su dígito de verificación es correcto. */
export function isValidNit(nit: string): boolean {
  const match = /^(\d{9,15})-(\d)$/u.exec(nit);
  if (match?.[1] === undefined || match[2] === undefined) return false;
  return computeNitCheckDigit(match[1]) === Number(match[2]);
}
