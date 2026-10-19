import { expect, test } from '../../fixtures/test';

const PAGES = [
  { link: 'Nosotros', path: '/nosotros', h1: 'Nosotros' },
  { link: 'Servicios', path: '/servicios', h1: 'Servicios' },
  { link: 'Planes', path: '/planes', h1: 'Planes' },
  { link: 'Preguntas frecuentes', path: '/preguntas-frecuentes', h1: 'Preguntas frecuentes' },
  { link: 'Contáctanos', path: '/contactanos', h1: 'Contáctanos' },
  { link: 'Inicio', path: '/', h1: 'Aprende a conducir con confianza' },
] as const;

test.describe('navegación', () => {
  test('el menú lleva a cada página, marca la activa y pasa el foco al contenido', async ({
    site,
    isMobile,
  }) => {
    test.skip(
      isMobile,
      'En el celular se navega con el menú a pantalla completa (mobile-menu.spec).',
    );
    await site.skipPrivacyNotice();
    await site.goto('/');
    for (const page of PAGES) {
      await site.mainNav().getByRole('link', { name: page.link }).click();
      await expect(site.page).toHaveURL(page.path);
      await expect(site.mainHeading()).toHaveText(page.h1);
      await expect(site.mainNav().getByRole('link', { name: page.link })).toHaveAttribute(
        'aria-current',
        'page',
      );
      await expect(site.page).toHaveTitle(/Conducir J&R del Sinú/u);
      await expect(site.main()).toBeFocused();
    }
    expect(site.consoleErrors).toEqual([]);
  });

  test('"Saltar al contenido" es el primer enlace y lleva al contenido', async ({
    site,
    browserName,
  }) => {
    test.skip(
      browserName === 'webkit',
      'Safari no enfoca enlaces con Tab salvo que el usuario lo active.',
    );
    await site.skipPrivacyNotice();
    await site.goto('/planes');
    await site.page.keyboard.press('Tab');
    const skip = site.page.getByRole('link', { name: 'Saltar al contenido' });
    await expect(skip).toBeFocused();
    await expect(skip).toBeInViewport();
    await skip.press('Enter');
    await expect(site.page).toHaveURL(/#contenido$/u);
  });

  test('el footer enlaza las páginas y la Política de Tratamiento de Datos', async ({ site }) => {
    await site.skipPrivacyNotice();
    await site.goto('/');
    await site.footer().getByRole('link', { name: 'Política de Tratamiento de Datos' }).click();
    await expect(site.page).toHaveURL('/politica-de-tratamiento-de-datos');
    await expect(site.mainHeading()).toHaveText('Política de tratamiento de datos');
  });

  test('la 404 lleva de vuelta al inicio', async ({ site }) => {
    await site.skipPrivacyNotice();
    await site.goto('/ruta-que-no-existe');
    await expect(site.mainHeading()).toHaveText('Te saliste de la vía');
    await site.main().getByRole('link', { name: 'Volver al inicio' }).click();
    await expect(site.page).toHaveURL('/');
    await expect(site.mainHeading()).toHaveText('Aprende a conducir con confianza');
  });
});
