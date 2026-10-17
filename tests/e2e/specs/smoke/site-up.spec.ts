import { SitePage, WHATSAPP_NUMBER } from '../../pages/SitePage';
import { expect, test } from '../../fixtures/test';

/**
 * Smoke de PDN: corre contra el sitio publicado después de cada despliegue
 * (`npm run test:e2e:smoke`). Comprueba lo que no puede fallar: que el sitio carga,
 * que WhatsApp y la ubicación funcionan y que los buscadores pueden indexarlo.
 */
test('el sitio responde y muestra el titular sin errores', async ({ home }) => {
  await home.skipPrivacyNotice();
  await home.open();
  await expect(home.mainHeading()).toHaveText('Aprende a conducir con confianza en Cereté');
  expect(home.consoleErrors).toEqual([]);
});

test('WhatsApp abre el chat con el número y el mensaje de la página', async ({ home }) => {
  await home.skipPrivacyNotice();
  await home.open();
  expect(await SitePage.whatsAppNumber(home.heroWhatsApp())).toBe(WHATSAPP_NUMBER);
  expect(await SitePage.whatsAppMessage(home.floatingWhatsApp())).toMatch(/página web/u);
});

test('Contáctanos muestra la dirección y "Cómo llegar" con las coordenadas', async ({
  contact,
}) => {
  await contact.skipPrivacyNotice();
  await contact.open();
  await expect(contact.main()).toContainText('Calle 13 # 10-96, Cereté, Córdoba, Colombia');
  await expect(contact.directionsLink()).toHaveAttribute('href', /destination=8\.8877998/u);
});

test('PDN es indexable: robots, sitemap y página sin noindex', async ({ request }) => {
  const robots = await (await request.get('/robots.txt')).text();
  expect(robots).toContain('Allow: /');
  expect(robots).toContain('Sitemap: https://conducirjrdelsinu.pages.dev/sitemap.xml');
  const sitemap = await request.get('/sitemap.xml');
  expect(sitemap.status()).toBe(200);
  expect(await sitemap.text()).toContain('<loc>https://conducirjrdelsinu.pages.dev/planes</loc>');
  const home = await (await request.get('/')).text();
  expect(home).toContain('<meta name="robots" content="index, follow" />');
});

test('una ruta inexistente responde 404', async ({ request }) => {
  expect((await request.get('/esta-ruta-no-existe')).status()).toBe(404);
});
