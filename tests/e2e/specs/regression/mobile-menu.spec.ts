import { expect, test } from '../../fixtures/test';

test.describe('menú móvil', () => {
  test.beforeEach(async ({ site, isMobile }) => {
    test.skip(!isMobile, 'El menú a pantalla completa es del celular (y pantallas < 1000 px).');
    await site.skipPrivacyNotice();
    await site.goto('/');
  });

  test('☰ lo abre; Esc lo cierra y el foco vuelve a ☰', async ({ site }) => {
    await site.menuButton().click();
    await expect(site.mobileMenu()).toBeVisible();
    await expect(site.menuButton()).toHaveAttribute('aria-expanded', 'true');
    await site.page.keyboard.press('Escape');
    await expect(site.mobileMenu()).toBeHidden();
    await expect(site.menuButton()).toBeFocused();
  });

  test('el foco no sale del menú abierto', async ({ site }) => {
    await site.menuButton().click();
    for (let step = 0; step < 12; step += 1) {
      await site.page.keyboard.press('Tab');
      const outside = await site.page.evaluate(() => {
        const active = document.activeElement;
        return active !== null && active !== document.body && active.closest('dialog') === null;
      });
      expect(outside).toBe(false);
    }
  });

  test('un enlace navega, cierra el menú y pasa el foco al contenido', async ({ site }) => {
    await site.menuButton().click();
    await site.mobileMenu().getByRole('link', { name: 'Contáctanos' }).click();
    await expect(site.page).toHaveURL('/contactanos');
    await expect(site.mobileMenu()).toBeHidden();
    await expect(site.mainHeading()).toHaveText('Contáctanos');
    await expect(site.main()).toBeFocused();
  });

  test('trae WhatsApp y "Llamar" a todo el ancho', async ({ site }) => {
    await site.menuButton().click();
    const menu = site.mobileMenu();
    await expect(menu.getByRole('link', { name: /Escríbenos por WhatsApp/u })).toBeVisible();
    await expect(menu.getByRole('link', { name: 'Llamar' })).toHaveAttribute(
      'href',
      'tel:+573165641048',
    );
  });
});
