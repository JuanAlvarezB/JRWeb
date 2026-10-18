import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createContainer } from '@/di/container';
import { InvalidContentError } from '@/domain/errors/InvalidContentError';
import { ROUTES } from '@/shared/constants/routes';
import { inMemoryRepositories } from '../unit/domain/fakes';
import { at } from '../unit/domain/samples';
import { renderRoute } from './renderRoute';

afterEach(() => {
  vi.restoreAllMocks();
});

const PAGES: readonly (readonly [string, RegExp, string])[] = [
  [ROUTES.home, /Aprende a conducir con confianza en Cereté/u, 'Inicio'],
  [ROUTES.about, /^Nosotros$/u, 'Nosotros'],
  [ROUTES.services, /^Servicios$/u, 'Servicios'],
  [ROUTES.plans, /^Planes$/u, 'Planes'],
  [ROUTES.contact, /^Contáctanos$/u, 'Contáctanos'],
  [ROUTES.faq, /^Preguntas frecuentes$/u, 'Preguntas frecuentes'],
  [ROUTES.dataPolicy, /^Política de tratamiento de datos$/u, ''],
];

describe('páginas del sitio', () => {
  for (const [path, title, navLabel] of PAGES) {
    it(`${path}: un solo H1, título de pestaña y enlace activo en el menú`, async () => {
      renderRoute(path);
      expect(await screen.findByRole('heading', { level: 1, name: title })).toBeInTheDocument();
      expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
      await waitFor(() => {
        expect(document.title).toMatch(/Conducir J&R del Sinú/u);
      });
      if (navLabel !== '') {
        const nav = at(screen.getAllByRole('navigation', { name: 'Navegación principal' }), 0);
        expect(within(nav).getByRole('link', { name: navLabel })).toHaveAttribute(
          'aria-current',
          'page',
        );
      }
    });
  }

  it('una ruta inexistente muestra la 404 con el velocímetro en cero', async () => {
    renderRoute('/no-existe');
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Te saliste de la vía' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Velocímetro en cero' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Volver al inicio' })).toHaveAttribute('href', '/');
  });

  it('la política muestra el texto oficial con su índice y la sección de analítica', async () => {
    renderRoute(ROUTES.dataPolicy);
    const index = await screen.findByRole('navigation', { name: 'Índice' });
    const links = within(index).getAllByRole('link');
    expect(links.length).toBeGreaterThan(20);
    expect(links[0]).toHaveAttribute('href', '#1-marco-normativo-e-identificacion-del-responsable');
    expect(screen.getByRole('heading', { name: 'Analítica del sitio web' })).toBeInTheDocument();
    expect(screen.getByText(/Vigente desde el 15 de enero de 2024/u)).toBeInTheDocument();
    const article = screen.getByRole('article', {
      name: /Política de Tratamiento de Datos Personales/u,
    });
    expect(
      within(article).getByRole('link', { name: 'conducirdelsinu@gmail.com' }),
    ).toHaveAttribute('href', 'mailto:conducirdelsinu@gmail.com');
  });

  it('Preguntas frecuentes: un grupo por tema, con la primera pregunta abierta', async () => {
    renderRoute(ROUTES.faq);
    for (const topic of ['Cursos', 'Horarios', 'Precios y requisitos', 'Ubicación']) {
      expect(await screen.findByRole('heading', { level: 2, name: topic })).toBeInTheDocument();
    }
    expect(
      screen.getByRole('button', { name: '¿Desde qué edad puedo hacer el curso?' }),
    ).toHaveAttribute('aria-expanded', 'true');
  });

  it('Inicio sin opiniones no muestra la sección de testimonios', async () => {
    const { InMemoryTestimonialRepository } = await import('../unit/domain/fakes');
    const { rating } = await import('../unit/domain/samples');
    renderRoute(
      ROUTES.home,
      createContainer(
        inMemoryRepositories({ testimonials: new InMemoryTestimonialRepository([], rating) }),
      ),
    );
    expect(await screen.findByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: 'Lo que dicen de nosotros' }),
    ).not.toBeInTheDocument();
  });

  it('si una página falla, el Error Boundary la reemplaza y el menú sigue disponible', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const broken = {
      list: () => Promise.reject(new InvalidContentError('Plan', ['sin horas'])),
    };
    renderRoute(ROUTES.plans, createContainer(inMemoryRepositories({ plans: broken })));
    expect(await screen.findByRole('alert')).toHaveTextContent('Algo salió mal');
    expect(screen.getByRole('button', { name: 'Recargar la página' })).toBeInTheDocument();
    expect(
      screen.getAllByRole('navigation', { name: 'Navegación principal' }).length,
    ).toBeGreaterThan(0);
  });
});

describe('layout', () => {
  it('menú móvil: ☰ lo abre, un enlace navega y lo cierra', async () => {
    const user = userEvent.setup();
    renderRoute(ROUTES.home);
    const open = await screen.findByRole('button', { name: 'Abrir menú' });
    await user.click(open);
    expect(open).toHaveAttribute('aria-expanded', 'true');
    const menu = screen.getByRole('dialog', { name: 'Menú' });
    await user.click(within(menu).getByRole('link', { name: 'Planes' }));
    expect(await screen.findByRole('heading', { level: 1, name: 'Planes' })).toBeInTheDocument();
    expect(open).toHaveAttribute('aria-expanded', 'false');
  });

  it('menú móvil: X lo cierra y el foco vuelve a ☰', async () => {
    const user = userEvent.setup();
    renderRoute(ROUTES.home);
    const open = await screen.findByRole('button', { name: 'Abrir menú' });
    await user.click(open);
    await user.click(screen.getByRole('button', { name: 'Cerrar menú' }));
    expect(open).toHaveAttribute('aria-expanded', 'false');
    expect(open).toHaveFocus();
  });

  it('aviso de privacidad: aparece en la primera visita y "Entendido" lo guarda', async () => {
    const user = userEvent.setup();
    renderRoute(ROUTES.home);
    const notice = await screen.findByRole('region', { name: 'Aviso de privacidad' });
    expect(
      within(notice).getByRole('link', { name: 'Política de Tratamiento de Datos' }),
    ).toHaveAttribute('href', ROUTES.dataPolicy);
    await user.click(within(notice).getByRole('button', { name: 'Entendido' }));
    expect(screen.queryByRole('region', { name: 'Aviso de privacidad' })).not.toBeInTheDocument();
    expect(localStorage.getItem('aviso-privacidad')).toBe('visto');
  });

  it('aviso de privacidad: no aparece si ya se leyó', async () => {
    localStorage.setItem('aviso-privacidad', 'visto');
    renderRoute(ROUTES.home);
    expect(await screen.findByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.queryByRole('region', { name: 'Aviso de privacidad' })).not.toBeInTheDocument();
  });

  it('botón flotante, "Saltar al contenido" y footer con NIT, horarios y redes', async () => {
    renderRoute(ROUTES.home);
    await screen.findByRole('heading', { level: 1 });
    expect(screen.getByRole('link', { name: 'Saltar al contenido' })).toHaveAttribute(
      'href',
      '#contenido',
    );
    expect(document.getElementById('contenido')?.tagName).toBe('MAIN');
    const fab = screen.getByRole('link', {
      name: 'Escríbenos por WhatsApp (se abre en una pestaña nueva)',
    });
    expect(fab.getAttribute('href')).toMatch(/^https:\/\/wa\.me\/573165641048\?text=/u);

    const footer = screen.getByRole('contentinfo');
    expect(within(footer).getByText(/NIT 901722359-5/u)).toBeInTheDocument();
    expect(within(footer).getByText('Teóricas · lun a vie')).toBeInTheDocument();
    expect(within(footer).getByRole('link', { name: /^TikTok/u })).toHaveAttribute(
      'href',
      'https://www.tiktok.com/@ceaconducirjrdelsinu',
    );
    expect(
      within(footer).getByRole('link', { name: 'Política de Tratamiento de Datos' }),
    ).toHaveAttribute('href', ROUTES.dataPolicy);
  });

  it('marca <html data-hydrated> cuando la página ya es interactiva', async () => {
    document.documentElement.removeAttribute('data-hydrated');
    renderRoute(ROUTES.home);
    await screen.findByRole('heading', { level: 1 });
    expect(document.documentElement).toHaveAttribute('data-hydrated');
  });

  it('la etiqueta QA no aparece fuera del ambiente de QA', async () => {
    renderRoute(ROUTES.home);
    await screen.findByRole('heading', { level: 1 });
    expect(screen.queryByText('Ambiente de pruebas')).not.toBeInTheDocument();
  });
});
