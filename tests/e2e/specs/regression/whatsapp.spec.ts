import { SitePage, WHATSAPP_NUMBER } from '../../pages/SitePage';
import { expect, test } from '../../fixtures/test';

const GENERAL = 'Hola, vi la página web y quiero información sobre los cursos.';

test.describe('WhatsApp', () => {
  test('el hero y el botón flotante abren el chat con el mensaje general en otra pestaña', async ({
    home,
  }) => {
    await home.skipPrivacyNotice();
    await home.open();
    for (const link of [home.heroWhatsApp(), home.floatingWhatsApp()]) {
      expect(await SitePage.whatsAppNumber(link)).toBe(WHATSAPP_NUMBER);
      expect(await SitePage.whatsAppMessage(link)).toBe(GENERAL);
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('rel', /noopener/u);
    }
  });

  for (const category of ['A2', 'B1', 'C1'] as const) {
    test(`Planes: precio y requisitos de ${category} con su categoría en el mensaje`, async ({
      plans,
    }) => {
      await plans.skipPrivacyNotice();
      await plans.open();
      const name = `Licencia ${category}`;
      await expect(plans.planCard(name)).not.toContainText(/\$\s?\d/u);
      expect(await SitePage.whatsAppMessage(plans.priceLink(name))).toBe(
        `Hola, vi en la página web el curso ${category} y quiero conocer el precio.`,
      );
      expect(await SitePage.whatsAppMessage(plans.requirementsLink(name))).toBe(
        `Hola, vi en la página web el curso ${category} y quiero conocer los requisitos.`,
      );
    });
  }

  test('todos los enlaces de WhatsApp del sitio usan el número principal o el segundo', async ({
    site,
  }) => {
    await site.skipPrivacyNotice();
    for (const path of ['/', '/servicios', '/planes', '/contactanos', '/preguntas-frecuentes']) {
      await site.goto(path);
      const hrefs = await site.page
        .locator('a[href^="https://wa.me/"]')
        .evaluateAll((links) =>
          links.map((link) => new URL((link as HTMLAnchorElement).href).pathname.slice(1)),
        );
      expect(hrefs.length).toBeGreaterThan(0);
      for (const number of hrefs) expect(['573165641048', '573246525153']).toContain(number);
    }
  });
});
