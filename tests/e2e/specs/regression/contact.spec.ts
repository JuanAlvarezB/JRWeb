import { expect, test } from '../../fixtures/test';

test.describe('Contáctanos', () => {
  test.beforeEach(async ({ contact, page }) => {
    // El mapa de Google se sustituye por una página vacía: la prueba no depende de la red.
    await page.route('https://www.google.com/maps/embed**', (route) =>
      route.fulfill({ status: 200, contentType: 'text/html', body: '<title>Mapa</title>' }),
    );
    await contact.skipPrivacyNotice();
    await contact.open();
  });

  test('llamada, correo y redes con su enlace', async ({ contact }) => {
    await expect(
      contact.channelCard('Celular').getByRole('link', { name: 'Llamar' }).first(),
    ).toHaveAttribute('href', 'tel:+573165641048');
    await expect(
      contact.channelCard('Correo').getByRole('link', { name: 'Escribir correo' }),
    ).toHaveAttribute('href', 'mailto:conducirdelsinu@gmail.com');
    for (const [label, url] of [
      ['Facebook', 'https://www.facebook.com/ceaconducirjrdelsinu/'],
      ['Instagram', 'https://www.instagram.com/ceaconducirjrdelsinu/'],
      ['TikTok', 'https://www.tiktok.com/@ceaconducirjrdelsinu'],
    ] as const) {
      await expect(contact.channelCard(label).getByRole('link').first()).toHaveAttribute(
        'href',
        url,
      );
    }
  });

  test('"Copiar" copia el dato y lo anuncia (escritorio)', async ({
    contact,
    browserName,
    isMobile,
  }) => {
    test.skip(isMobile, '"Copiar" solo existe en escritorio.');
    test.skip(browserName !== 'chromium', 'Solo Chromium permite leer el portapapeles en pruebas.');
    await contact.page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
    await contact.copyButton('conducirdelsinu@gmail.com').click();
    await expect(contact.copyStatus()).toHaveText(
      'conducirdelsinu@gmail.com copiado al portapapeles',
    );
    await expect(contact.copyButton('conducirdelsinu@gmail.com')).toHaveText('Copiado');
    expect(await contact.page.evaluate(() => navigator.clipboard.readText())).toBe(
      'conducirdelsinu@gmail.com',
    );
  });

  test('el mapa de Google solo se carga al tocar "Ver mapa"', async ({ contact }) => {
    const googleRequests: string[] = [];
    contact.page.on('request', (request) => {
      if (request.url().includes('google.com')) googleRequests.push(request.url());
    });
    await expect(contact.mapFrame()).toHaveCount(0);
    expect(googleRequests).toEqual([]);
    await contact.showMapButton().click();
    await expect(contact.mapFrame()).toHaveAttribute(
      'src',
      /^https:\/\/www\.google\.com\/maps\/embed/u,
    );
    await expect(contact.mapFrame()).toBeFocused();
  });

  test('"Cómo llegar" y Waze apuntan a las coordenadas de la sede', async ({ contact }) => {
    await expect(contact.directionsLink()).toHaveAttribute(
      'href',
      /destination=8\.8877998%2C-75\.7887601/u,
    );
    await expect(contact.wazeLink()).toHaveAttribute('href', /ll=8\.8877998%2C-75\.7887601/u);
    await expect(contact.schedules()).toContainText('Lunes a viernes');
  });
});
