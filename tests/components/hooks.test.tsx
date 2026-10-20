import type { QueryClient } from '@tanstack/react-query';
import { render, renderHook, screen, waitFor } from '@testing-library/react';
import { Component, Suspense, type JSX, type ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { createContainer, type Repositories } from '@/di/container';
import { SOCIAL_KINDS } from '@/domain/entities/ContactChannel';
import { totalHours } from '@/domain/entities/CourseHours';
import { InvalidContentError } from '@/domain/errors/InvalidContentError';
import { queries } from '@/presentation/hooks/queries';
import { useCompanyInfo } from '@/presentation/hooks/useCompanyInfo';
import { useContactChannels } from '@/presentation/hooks/useContactChannels';
import { useDataPolicy } from '@/presentation/hooks/useDataPolicy';
import { useFaqGroups, useFaqs } from '@/presentation/hooks/useFaqs';
import { usePlans } from '@/presentation/hooks/usePlans';
import { useSchedule } from '@/presentation/hooks/useSchedule';
import { useSchoolLocation } from '@/presentation/hooks/useSchoolLocation';
import { useServices } from '@/presentation/hooks/useServices';
import { useTestimonials } from '@/presentation/hooks/useTestimonials';
import { useWhatsAppLink } from '@/presentation/hooks/useWhatsAppLink';
import { AppProviders } from '@/presentation/providers/AppProviders';
import { createQueryClient } from '@/presentation/providers/queryClient';
import { inMemoryRepositories } from '../unit/domain/fakes';

interface WrapperProps {
  readonly children: ReactNode;
}

/** Providers reales + Suspense, como los montará cada página. */
function wrapperWith(
  dependencies = createContainer(),
  queryClient: QueryClient = createQueryClient(),
): (props: WrapperProps) => JSX.Element {
  return function Wrapper({ children }: WrapperProps) {
    return (
      <AppProviders dependencies={dependencies} queryClient={queryClient}>
        <Suspense fallback={<p>Cargando</p>}>{children}</Suspense>
      </AppProviders>
    );
  };
}

/** Error Boundary mínimo para la prueba (el de cada página llega con las páginas). */
class Boundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  override state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error): { error: Error } {
    return { error };
  }
  override render(): ReactNode {
    return this.state.error === null ? (
      this.props.children
    ) : (
      <p role="alert">{this.state.error.name}</p>
    );
  }
}

async function hookResult<T>(hook: () => T, wrapper = wrapperWith()): Promise<T> {
  const { result } = renderHook(hook, { wrapper });
  await waitFor(() => {
    expect(result.current).not.toBeNull();
  });
  return result.current;
}

describe('hooks de datos con el contenido real', () => {
  it('useCompanyInfo, useServices y usePlans', async () => {
    expect((await hookResult(useCompanyInfo)).nit).toBe('901722359-5');
    expect((await hookResult(useServices)).map((service) => service.category)).toEqual([
      'A2',
      'B1',
      'C1',
    ]);
    expect((await hookResult(usePlans)).map((plan) => totalHours(plan.hours))).toEqual([
      43, 50, 65,
    ]);
  });

  it('useSchedule, useTestimonials y useDataPolicy', async () => {
    expect((await hookResult(useSchedule)).blocks.map((block) => block.id)).toEqual([
      'theory-day',
      'theory-night',
      'practice',
    ]);
    expect((await hookResult(useTestimonials)).rating.reviewCount).toBe(5);
    expect((await hookResult(useDataPolicy)).sections.length).toBeGreaterThan(20);
  });

  it('useFaqs por página y useFaqGroups por tema', async () => {
    expect((await hookResult(() => useFaqs({ page: 'plans' }))).map((faq) => faq.id)).toEqual([
      'edad',
      'horas',
      'precio',
      'requisitos',
    ]);
    expect((await hookResult(useFaqGroups)).map((group) => group.topic)).toEqual([
      'courses',
      'schedules',
      'pricing',
      'location',
    ]);
  });

  it('useContactChannels entrega enlaces listos y filtra por tipo', async () => {
    const all = await hookResult(() => useContactChannels());
    expect(all.map((channel) => channel.kind)).toEqual([
      'whatsapp',
      'phone',
      'email',
      'facebook',
      'instagram',
      'tiktok',
    ]);
    expect(all[1]?.entries[0]?.href).toBe('tel:+573165641048');
    const social = await hookResult(() => useContactChannels(SOCIAL_KINDS));
    expect(social.every((channel) => channel.entries.every((entry) => entry.external))).toBe(true);
  });

  it('useWhatsAppLink arma el mensaje de la consulta', async () => {
    const href = await hookResult(() => useWhatsAppLink({ topic: 'price', category: 'A2' }));
    expect(new URL(href).searchParams.get('text')).toBe(
      'Hola, vi en la página web el curso A2 y quiero conocer el precio.',
    );
  });

  it('useSchoolLocation incluye la dirección completa y "Cómo llegar"', async () => {
    const view = await hookResult(useSchoolLocation);
    expect(view.fullAddress).toBe('Calle 13 # 10-96, Cereté, Córdoba, Colombia');
    expect(view.directionsUrl).toContain('destination=8.8877998%2C-75.7887601');
  });
});

describe('caché y errores', () => {
  it('con la caché precargada (prerender) responde sin suspender ni repetir la consulta', async () => {
    const dependencies = createContainer(inMemoryRepositories());
    const queryClient = createQueryClient();
    await queryClient.query(queries.plans(dependencies));
    const execute = vi.spyOn(dependencies.listPlans, 'execute');

    const { result } = renderHook(usePlans, { wrapper: wrapperWith(dependencies, queryClient) });

    expect(result.current.map((plan) => plan.category)).toEqual(['A2', 'B1', 'C1']);
    expect(execute).not.toHaveBeenCalled();
  });

  it('dos componentes con el mismo hook comparten una sola ejecución del caso de uso', async () => {
    const dependencies = createContainer(inMemoryRepositories());
    const execute = vi.spyOn(dependencies.listServices, 'execute');
    function Count(): JSX.Element {
      return <p>{useServices().length}</p>;
    }
    render(
      <>
        <Count />
        <Count />
      </>,
      { wrapper: wrapperWith(dependencies) },
    );
    expect(await screen.findAllByText('2')).toHaveLength(2);
    expect(execute).toHaveBeenCalledTimes(1);
  });

  it('un contenido inválido llega al Error Boundary de la página', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const broken: Repositories['plans'] = {
      list: () => Promise.reject(new InvalidContentError('Plan', ['sin horas'])),
    };
    function Plans(): JSX.Element {
      return <p>{usePlans().length}</p>;
    }
    render(
      <Boundary>
        <Plans />
      </Boundary>,
      { wrapper: wrapperWith(createContainer(inMemoryRepositories({ plans: broken }))) },
    );
    expect(await screen.findByRole('alert')).toHaveTextContent('InvalidContentError');
    vi.restoreAllMocks();
  });
});
