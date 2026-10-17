import { expect, test } from '../../fixtures/test';
import { findAccessibilityViolations } from '../../utils/accessibility';

/**
 * Base común de todas las páginas. Se amplía en la etapa de pruebas con las rutas
 * del sitio (Inicio, Nosotros, Servicios, Planes, Contáctanos, Preguntas, Política, 404).
 */
const PAGES = ['/'] as const;

for (const path of PAGES) {
  test.describe(`Página ${path}`, () => {
    test('carga en español, con un único H1 y sin errores de consola', async ({ site }) => {
      await site.goto(path);
      expect(await site.documentLanguage()).toBe('es-CO');
      await expect(site.mainHeading()).toHaveCount(1);
      expect(site.consoleErrors).toEqual([]);
    });

    test('no tiene violaciones de accesibilidad WCAG AA', async ({ site }) => {
      await site.goto(path);
      expect(await findAccessibilityViolations(site.page)).toEqual([]);
    });
  });
}
