import { expect, test } from '../../fixtures/test';

/** Smoke de PDN: el sitio responde y renderiza. Se amplía con WhatsApp y ubicación. */
test('el sitio responde y muestra el titular', async ({ site }) => {
  await site.goto('/');
  await expect(site.mainHeading()).toBeVisible();
  expect(site.consoleErrors).toEqual([]);
});
