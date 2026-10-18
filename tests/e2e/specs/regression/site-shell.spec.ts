import { expect, test } from '../../fixtures/test';
import { findAccessibilityViolations } from '../../utils/accessibility';

const NOT_FOUND_PATH = '/no-existe';

/**
 * Base común de todas las páginas: idioma, un único H1, sin errores de consola y sin
 * violaciones WCAG AA. `/no-existe` cubre la página 404.
 */
const PAGES = [
  '/',
  '/nosotros',
  '/servicios',
  '/planes',
  '/contactanos',
  '/preguntas-frecuentes',
  '/politica-de-tratamiento-de-datos',
  NOT_FOUND_PATH,
] as const;

for (const path of PAGES) {
  test.describe(`Página ${path}`, () => {
    test('carga en español, con un único H1 y sin errores de consola', async ({ site }) => {
      await site.goto(path);
      expect(await site.documentLanguage()).toBe('es-CO');
      await expect(site.mainHeading()).toHaveCount(1);
      // La 404 responde con estado HTTP 404 (como Cloudflare Pages) y el navegador lo
      // anota en la consola: solo en esa ruta se ignora ese aviso del documento.
      const errors =
        path === NOT_FOUND_PATH ? site.consoleErrorsIgnoringDocument404(path) : site.consoleErrors;
      expect(errors).toEqual([]);
    });

    test('no tiene violaciones de accesibilidad WCAG AA', async ({ site }) => {
      await site.goto(path);
      expect(await findAccessibilityViolations(site.page)).toEqual([]);
    });
  });
}
