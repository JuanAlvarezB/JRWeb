import { expect, test } from '../../fixtures/test';

/**
 * Regresión visual: cada página completa a 1440 y 390 px (los anchos de los mockups),
 * sin el aviso de privacidad y con el movimiento reducido. Las capturas de referencia
 * se generan en Linux (README de esta carpeta).
 */
const PAGES = [
  { name: 'inicio', path: '/' },
  { name: 'nosotros', path: '/nosotros' },
  { name: 'servicios', path: '/servicios' },
  { name: 'planes', path: '/planes' },
  { name: 'contactanos', path: '/contactanos' },
  { name: 'preguntas-frecuentes', path: '/preguntas-frecuentes' },
  { name: 'politica-datos', path: '/politica-de-tratamiento-de-datos' },
  { name: '404', path: '/no-existe' },
] as const;

const VIEWPORTS = [
  { width: 1440, height: 900 },
  { width: 390, height: 844 },
] as const;

for (const viewport of VIEWPORTS) {
  test.describe(`${String(viewport.width)} px`, () => {
    test.use({ viewport });

    for (const page of PAGES) {
      test(page.name, async ({ site }) => {
        await site.skipPrivacyNotice();
        await site.goto(page.path);
        await expect(site.mainHeading()).toBeVisible();
        await site.page.evaluate(() => document.fonts.ready);
        await expect(site.page).toHaveScreenshot(`${page.name}-${String(viewport.width)}.png`, {
          fullPage: true,
        });
      });
    }
  });
}
