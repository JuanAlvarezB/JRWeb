import { useQuery } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import type { JSX } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { createContainer } from '@/di/container';
import { InvalidContentError } from '@/domain/errors/InvalidContentError';
import type { PlanRepository } from '@/domain/repositories/PlanRepository';
import { AppProviders } from '@/presentation/providers/AppProviders';
import { useDependencies } from '@/presentation/providers/dependencyContext';
import { createQueryClient } from '@/presentation/providers/queryClient';
import { inMemoryRepositories } from '../unit/domain/fakes';

/** Consumidor mínimo: el mismo flujo que tendrán los hooks (hook → caso de uso). */
function PlanCategories(): JSX.Element {
  const { listPlans } = useDependencies();
  const query = useQuery({ queryKey: ['plans'], queryFn: () => listPlans.execute() });
  if (query.isError) return <p role="alert">{query.error.name}</p>;
  if (query.data === undefined) return <p>Cargando</p>;
  return <p>{query.data.map((plan) => plan.category).join(' ')}</p>;
}

describe('AppProviders', () => {
  it('entrega los casos de uso del contenedor y cachea el resultado en TanStack Query', async () => {
    const queryClient = createQueryClient();
    render(
      <AppProviders
        dependencies={createContainer(inMemoryRepositories())}
        queryClient={queryClient}
      >
        <PlanCategories />
      </AppProviders>,
    );

    expect(await screen.findByText('A2 B1 C1')).toBeInTheDocument();
    expect(queryClient.getQueryData(['plans'])).toHaveLength(3);
  });

  it('crea su propio cliente de consultas si no se le pasa uno', async () => {
    render(
      <AppProviders dependencies={createContainer(inMemoryRepositories())}>
        <PlanCategories />
      </AppProviders>,
    );
    expect(await screen.findByText('A2 B1 C1')).toBeInTheDocument();
  });

  it('un error del dominio se muestra de inmediato, sin reintentos', async () => {
    const list = vi.fn(() => Promise.reject(new InvalidContentError('Plan', ['sin horas'])));
    const broken: PlanRepository = { list };
    render(
      <AppProviders dependencies={createContainer(inMemoryRepositories({ plans: broken }))}>
        <PlanCategories />
      </AppProviders>,
    );

    expect(await screen.findByRole('alert')).toHaveTextContent('InvalidContentError');
    expect(list).toHaveBeenCalledTimes(1);
  });
});

describe('useDependencies', () => {
  it('fuera del DependencyProvider falla con un mensaje claro', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() => render(<PlanCategories />)).toThrow(
      'useDependencies debe usarse dentro de <DependencyProvider>.',
    );
    vi.restoreAllMocks();
  });
});
