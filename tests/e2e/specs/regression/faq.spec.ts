import { expect, test } from '../../fixtures/test';

test.describe('Preguntas frecuentes', () => {
  test.beforeEach(async ({ faq }) => {
    await faq.skipPrivacyNotice();
    await faq.open();
  });

  test('cuatro temas y la primera pregunta abierta', async ({ faq }) => {
    for (const topic of ['Cursos', 'Horarios', 'Precios y requisitos', 'Ubicación']) {
      await expect(faq.topic(topic)).toBeVisible();
    }
    await expect(faq.question('¿Desde qué edad puedo hacer el curso?')).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });

  test('abrir y cerrar una pregunta; varias pueden quedar abiertas', async ({ faq }) => {
    const question = '¿Cuánto cuesta el curso?';
    await faq.question(question).click();
    await expect(faq.question(question)).toHaveAttribute('aria-expanded', 'true');
    await expect(await faq.answer(question)).toContainText('te enviamos el precio');
    await expect(faq.question('¿Desde qué edad puedo hacer el curso?')).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    await faq.question(question).click();
    await expect(await faq.answer(question)).toBeHidden();
  });

  test('las respuestas con acción llevan a WhatsApp, a la sede o a Planes', async ({ faq }) => {
    await faq.question('¿Dónde están ubicados?').click();
    await expect((await faq.answer('¿Dónde están ubicados?')).getByRole('link')).toHaveAttribute(
      'href',
      /google\.com\/maps\/dir/u,
    );
    await faq.question('¿Cuántas horas dura cada curso?').click();
    await (await faq.answer('¿Cuántas horas dura cada curso?')).getByRole('link').click();
    await expect(faq.page).toHaveURL('/planes');
  });
});
