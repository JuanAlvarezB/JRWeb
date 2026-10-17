import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createContainer } from '@/di/container';
import { BenefitHighlights } from '@/presentation/components/features/BenefitHighlights';
import { ContactChannelGrid } from '@/presentation/components/features/ContactChannelGrid';
import { CourseHoursExplorer } from '@/presentation/components/features/CourseHoursExplorer';
import { FaqAccordion } from '@/presentation/components/features/FaqAccordion';
import { HeroFloatingCards } from '@/presentation/components/features/HeroFloatingCards';
import { LocationBlock } from '@/presentation/components/features/LocationBlock';
import { PlanGrid } from '@/presentation/components/features/PlanGrid';
import { ScheduleCards } from '@/presentation/components/features/ScheduleCards';
import { ServiceList } from '@/presentation/components/features/ServiceList';
import { TestimonialsGrid } from '@/presentation/components/features/TestimonialsGrid';
import {
  InMemoryLocationRepository,
  InMemoryTestimonialRepository,
  inMemoryRepositories,
} from '../unit/domain/fakes';
import { at, faqs, location, rating } from '../unit/domain/samples';
import { renderWithProviders } from './renderWithProviders';

const NBSP = ' ';
const textOf = (href: string | null): string | null =>
  href === null ? null : new URL(href).searchParams.get('text');

afterEach(() => {
  vi.restoreAllMocks();
});

describe('CourseHoursExplorer', () => {
  it('muestra B1 al cargar y cambia de categoría sin consultar de nuevo', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CourseHoursExplorer />);

    expect(await screen.findByRole('heading', { name: 'Licencia B1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'B1' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText('20 horas')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'C1' }));

    expect(screen.getByRole('heading', { name: 'Licencia C1' })).toBeInTheDocument();
    expect(
      screen.getByRole('img', { name: /Licencia C1: 65 horas en total/u }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Mayores de 18 años\./u)).toBeInTheDocument();
    expect(
      textOf(screen.getByRole('link', { name: /Consulta los requisitos/u }).getAttribute('href')),
    ).toBe('Hola, vi en la página web el curso C1 y quiero conocer los requisitos.');
  });
});

describe('PlanGrid', () => {
  it('tres planes sin precio, con WhatsApp de precio y requisitos por categoría', async () => {
    renderWithProviders(<PlanGrid variant="detailed" />);
    const cards = await screen.findAllByRole('listitem', { name: undefined });
    const plans = cards.filter((card) => within(card).queryByRole('heading') !== null);
    expect(plans).toHaveLength(3);

    const a2 = at(plans, 0);
    expect(within(a2).getByRole('heading', { name: 'Licencia A2' })).toBeInTheDocument();
    expect(within(a2).getByText('43 horas')).toBeInTheDocument();
    expect(within(a2).getByText('3 h')).toBeInTheDocument();
    expect(a2.textContent).not.toMatch(/\$|precio:/iu);
    expect(
      textOf(
        within(a2)
          .getByRole('link', { name: /Consultar precio/u })
          .getAttribute('href'),
      ),
    ).toBe('Hola, vi en la página web el curso A2 y quiero conocer el precio.');
  });

  it('la variante resumen muestra solo el total', async () => {
    renderWithProviders(<PlanGrid variant="summary" />);
    expect(await screen.findAllByText('Curso completo')).toHaveLength(3);
    expect(screen.queryByText('Incluye')).not.toBeInTheDocument();
  });
});

describe('BenefitHighlights y TestimonialsGrid', () => {
  it('diferenciadores reales y la calificación de Google con su fecha', async () => {
    renderWithProviders(<BenefitHighlights />);
    expect(
      await screen.findByRole('heading', { name: 'Instructores certificados' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '5.0 en Google' })).toBeInTheDocument();
    expect(
      screen.getByText('Calificación de 5.0 con 5 opiniones, a octubre de 2026.'),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Ver horarios/u })).toHaveAttribute(
      'href',
      '/contactanos#horarios',
    );
  });

  it('sin calificación publicada, no muestra la tarjeta de Google', async () => {
    const noRating = new InMemoryTestimonialRepository([], { ...rating, reviewCount: 0 });
    renderWithProviders(
      <BenefitHighlights />,
      createContainer(inMemoryRepositories({ testimonials: noRating })),
    );
    expect(await screen.findAllByRole('heading')).toHaveLength(2);
    expect(screen.queryByText(/en Google/u)).not.toBeInTheDocument();
  });

  it('opiniones reales con autor, fuente y fecha de consulta', async () => {
    renderWithProviders(<TestimonialsGrid header={<h2>Testimonios</h2>} />);
    expect(await screen.findByRole('heading', { name: 'Testimonios' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: '5.0 de 5 estrellas' })).toBeInTheDocument();
    expect(screen.getByText('Cruz P. ·')).toBeInTheDocument();
    expect(screen.getAllByText('consultada en octubre de 2026')).toHaveLength(2);
  });

  it('sin opiniones no muestra la sección (ni su encabezado)', async () => {
    const empty = new InMemoryTestimonialRepository([], rating);
    const { container } = renderWithProviders(
      <TestimonialsGrid header={<h2>Testimonios</h2>} />,
      createContainer(inMemoryRepositories({ testimonials: empty })),
    );
    await vi.waitFor(() => {
      expect(screen.queryByText('Cargando')).not.toBeInTheDocument();
    });
    expect(container).toBeEmptyDOMElement();
  });
});

describe('ContactChannelGrid', () => {
  it('cada dato con su acción; "Copiar" copia y lo anuncia', async () => {
    const user = userEvent.setup();
    const writeText = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue();
    renderWithProviders(<ContactChannelGrid />);

    expect(await screen.findByText('conducirdelsinu@gmail.com')).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: 'Llamar' })[0]).toHaveAttribute(
      'href',
      'tel:+573165641048',
    );
    expect(screen.getByRole('link', { name: /Ver página/u })).toHaveAttribute('target', '_blank');
    // Redes: sin "Copiar" (WhatsApp 2 + llamadas 2 + correo 1).
    expect(screen.getAllByRole('button', { name: /^Copiar/u })).toHaveLength(5);

    await user.click(screen.getByRole('button', { name: 'Copiar conducirdelsinu@gmail.com' }));

    expect(writeText).toHaveBeenCalledWith('conducirdelsinu@gmail.com');
    expect(await screen.findByRole('status')).toHaveTextContent(
      'conducirdelsinu@gmail.com copiado al portapapeles',
    );
    expect(
      screen.getByRole('button', { name: 'Copiar conducirdelsinu@gmail.com' }),
    ).toHaveTextContent('Copiado');
  });

  it('si el navegador no permite copiar, no muestra "Copiado"', async () => {
    const user = userEvent.setup();
    vi.spyOn(navigator.clipboard, 'writeText').mockRejectedValue(new Error('denegado'));
    renderWithProviders(<ContactChannelGrid kinds={['email']} />);
    await user.click(await screen.findByRole('button', { name: /^Copiar/u }));
    expect(screen.getByRole('status')).toBeEmptyDOMElement();
  });
});

describe('LocationBlock y LocationMap', () => {
  it('dirección, horarios, "Cómo llegar" y Waze con las coordenadas', async () => {
    renderWithProviders(<LocationBlock details="schedule" />);
    expect(await screen.findByText('Calle 13 # 10-96, Cereté, Córdoba')).toBeInTheDocument();
    expect(screen.getByText(/en cuatro franjas diurnas/u)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Cómo llegar/u }).getAttribute('href')).toContain(
      'destination=8.8877998%2C-75.7887601',
    );
    expect(screen.getByRole('link', { name: /Abrir en Waze/u }).getAttribute('href')).toContain(
      'll=8.8877998%2C-75.7887601',
    );
  });

  it('el mapa de Google solo se carga al tocar "Ver mapa" y recibe el foco', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LocationBlock details="googleName" />);
    expect(await screen.findByText(/En Google nos encuentras como/u)).toBeInTheDocument();
    expect(document.querySelector('iframe')).toBeNull();

    await user.click(screen.getByRole('button', { name: 'Ver mapa' }));

    const frame = screen.getByTitle(/^Mapa de CEA Conducir J&R del Sinú/u);
    expect(frame.getAttribute('src')).toMatch(/^https:\/\/www\.google\.com\/maps\/embed/u);
    expect(frame).toHaveFocus();
  });

  it('sin mapa embebido, "Ver mapa" abre el perfil de Google', async () => {
    const withoutEmbed = { ...location, embedUrl: undefined };
    renderWithProviders(
      <LocationBlock details="googleName" />,
      createContainer(
        inMemoryRepositories({ location: new InMemoryLocationRepository(withoutEmbed) }),
      ),
    );
    expect(await screen.findByRole('link', { name: /Ver mapa/u })).toHaveAttribute(
      'href',
      location.googleProfileUrl,
    );
  });
});

describe('HeroFloatingCards', () => {
  it('rodea el titular con datos reales de B1, horarios y ubicación', async () => {
    renderWithProviders(
      <HeroFloatingCards>
        <h1>Aprende a conducir</h1>
      </HeroFloatingCards>,
    );
    const cards = await screen.findByRole('list', { name: /Datos del curso/u });
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(within(cards).getByText('Licencia B1 · Servicio particular')).toBeInTheDocument();
    expect(within(cards).getByText('25 teoría · 5 taller · 20 manejo')).toBeInTheDocument();
    expect(within(cards).getByText('Diurna: lunes a viernes, cuatro franjas.')).toBeInTheDocument();
    expect(
      within(cards).getByText(`Nocturna: lun, mar y mié, 6:00–8:00${NBSP}p.${NBSP}m.`, {
        normalizer: (text) => text,
      }),
    ).toBeInTheDocument();
    expect(within(cards).getByText('Calle 13 # 10-96')).toBeInTheDocument();
  });
});

describe('ServiceList, ScheduleCards y FaqAccordion', () => {
  it('un bloque por servicio con su ficha y sin foto mientras no exista', async () => {
    renderWithProviders(<ServiceList />);
    expect(await screen.findByRole('heading', { name: 'Motocicletas' })).toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(3);
    expect(screen.getByText('Público')).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('una tarjeta por jornada con sus franjas o su nota', async () => {
    renderWithProviders(<ScheduleCards />);
    expect(await screen.findByRole('heading', { name: 'Lunes a viernes' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Lunes, martes y miércoles' })).toBeInTheDocument();
    expect(screen.getByText('Escríbenos para coordinar tus clases de manejo.')).toBeInTheDocument();
  });

  it('las acciones de las respuestas llevan a WhatsApp, a la sede o a Planes', async () => {
    const withPlans = [
      ...faqs,
      {
        ...at(faqs, 0),
        id: 'horas',
        action: { kind: 'plans', label: 'Ver la distribución' },
      } as const,
    ];
    renderWithProviders(
      <FaqAccordion faqs={withPlans} defaultOpen={withPlans.map((faq) => faq.id)} />,
    );
    const links = await screen.findAllByRole('link');
    const hrefs = links.map((link) => link.getAttribute('href') ?? '');
    expect(hrefs.some((href) => href.startsWith('https://wa.me/573165641048'))).toBe(true);
    expect(hrefs.some((href) => href.startsWith('https://www.google.com/maps/dir/'))).toBe(true);
    expect(hrefs).toContain('/planes');
  });
});
