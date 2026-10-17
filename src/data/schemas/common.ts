import { z } from 'zod';
import { LICENSE_CATEGORIES } from '../../domain/entities/LicenseCategory';

/**
 * Piezas comunes de los esquemas. Los objetos son estrictos: un campo que no está
 * en el esquema (p. ej. "precio") hace fallar la validación.
 */
export const text = z.string().trim().min(1, 'No puede estar vacío.');
export const licenseCategory = z.enum(LICENSE_CATEGORIES);
export const serviceType = z.enum(['private', 'public']);
export const isoDate = z.iso.date('Debe ser una fecha AAAA-MM-DD.');
export const httpsUrl = z.url({ protocol: /^https$/u, error: 'Debe ser una URL https.' });
export const nonNegativeInt = z.number().int().nonnegative();
