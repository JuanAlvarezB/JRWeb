import { expect, test } from '../../fixtures/test';

test.describe('aviso de privacidad', () => {
  test('aparece en la primera visita, enlaza la política y "Entendido" lo recuerda', async ({
    site,
  }) => {
    await site.goto('/');
    const notice = site.privacyNotice();
    await expect(notice).toBeVisible();
    await expect(
      notice.getByRole('link', { name: 'Política de Tratamiento de Datos' }),
    ).toHaveAttribute('href', '/politica-de-tratamiento-de-datos');
    await notice.getByRole('button', { name: 'Entendido' }).click();
    await expect(notice).toBeHidden();
    await site.page.reload();
    await expect(site.mainHeading()).toBeVisible();
    await expect(site.privacyNotice()).toBeHidden();
  });

  test('el botón de WhatsApp nunca tapa el aviso', async ({ site }) => {
    await site.goto('/');
    await expect(site.privacyNotice()).toBeVisible();
    const notice = await site.privacyNotice().boundingBox();
    const fab = await site.floatingWhatsApp().boundingBox();
    expect(notice).not.toBeNull();
    expect(fab).not.toBeNull();
    if (notice === null || fab === null) return;
    const overlaps =
      fab.x < notice.x + notice.width &&
      fab.x + fab.width > notice.x &&
      fab.y < notice.y + notice.height &&
      fab.y + fab.height > notice.y;
    expect(overlaps).toBe(false);
  });
});
