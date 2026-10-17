import type { Locator } from '@playwright/test';
import { expect, test } from '../../fixtures/test';

/** Una sección está bien ubicada si su borde superior queda bajo el menú fijo. */
async function topOf(locator: Locator): Promise<number> {
  return locator.evaluate((element) => element.getBoundingClientRect().top);
}

test.describe('anclas', () => {
  test('"Ver horarios" lleva a los horarios de Contáctanos, visibles bajo el menú', async ({
    home,
    contact,
  }) => {
    await home.skipPrivacyNotice();
    await home.open();
    await home.page.getByRole('link', { name: 'Ver horarios' }).click();
    await expect(home.page).toHaveURL('/contactanos#horarios');
    await expect(contact.schedules()).toBeInViewport();
    await expect.poll(() => topOf(contact.schedules())).toBeGreaterThanOrEqual(60);
  });

  test('el índice de la política lleva a cada sección', async ({ policy }) => {
    await policy.skipPrivacyNotice();
    await policy.open();
    await policy.indexLink('16. Aviso de privacidad').click();
    await expect(policy.page).toHaveURL(/#16-aviso-de-privacidad$/u);
    const section = policy.section('16-aviso-de-privacidad');
    await expect(section).toBeInViewport();
    await expect.poll(() => topOf(section)).toBeGreaterThanOrEqual(60);
  });
});
