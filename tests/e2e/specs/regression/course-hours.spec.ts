import { SitePage } from '../../pages/SitePage';
import { expect, test } from '../../fixtures/test';

test.describe('"Tu curso en horas"', () => {
  test.beforeEach(async ({ home }) => {
    await home.skipPrivacyNotice();
    await home.open();
  });

  test('muestra B1 al cargar con su reparto real de horas', async ({ home }) => {
    await expect(home.courseCategory('B1')).toHaveAttribute('aria-checked', 'true');
    await expect(home.courseTitle()).toHaveText('Licencia B1');
    await expect(home.courseHours('Teoría')).toContainText('25 horas');
    await expect(home.courseHours('Taller')).toContainText('5 horas');
    await expect(home.courseHours('Manejo')).toContainText('20 horas');
    await expect(home.courseArc()).toHaveAccessibleName(/Licencia B1: 50 horas en total/u);
  });

  test('al elegir C1 cambian las horas, el arco y el enlace de requisitos', async ({ home }) => {
    await home.courseCategory('C1').click();
    await expect(home.courseTitle()).toHaveText('Licencia C1');
    await expect(home.courseHours('Teoría')).toContainText('30 horas');
    await expect(home.courseHours('Manejo')).toContainText('30 horas');
    await expect(home.courseArc()).toHaveAccessibleName(/Licencia C1: 65 horas en total/u);
    expect(await SitePage.whatsAppMessage(home.courseRequirementsLink())).toBe(
      'Hola, vi en la página web el curso C1 y quiero conocer los requisitos.',
    );
  });

  test('con el teclado: flechas, Inicio y Fin (grupo de radios)', async ({ home }) => {
    await home.courseCategory('B1').focus();
    await home.page.keyboard.press('ArrowRight');
    await expect(home.courseCategory('C1')).toBeFocused();
    await expect(home.courseCategory('C1')).toHaveAttribute('aria-checked', 'true');
    await home.page.keyboard.press('Home');
    await expect(home.courseCategory('A2')).toBeFocused();
    await expect(home.courseTitle()).toHaveText('Licencia A2');
    await home.page.keyboard.press('ArrowLeft');
    await expect(home.courseCategory('C1')).toHaveAttribute('aria-checked', 'true');
  });
});
