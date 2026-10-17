import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SpeedometerArc } from '@/presentation/components/brand/SpeedometerArc';

describe('SpeedometerArc', () => {
  it('se anuncia como imagen con la descripción del curso', () => {
    render(
      <SpeedometerArc
        segments={[
          { id: 'theory', value: 25, tone: 'theory' },
          { id: 'workshop', value: 5, tone: 'workshop' },
          { id: 'driving', value: 20, tone: 'driving' },
        ]}
        centerValue="50"
        caption="horas en total"
        needle="end"
        label="Licencia B1: 50 horas en total. 25 de teoría, 5 de taller y 20 de manejo."
      />,
    );
    expect(
      screen.getByRole('img', { name: /licencia b1: 50 horas en total/i }),
    ).toBeInTheDocument();
  });

  it('dibuja un tramo por cada parte del curso', () => {
    const { container } = render(
      <SpeedometerArc
        segments={[{ id: 'full', value: 1, tone: 'brand' }]}
        centerValue="0"
        needle="start"
        label="Velocímetro en cero."
      />,
    );
    expect(container.querySelectorAll('circle')).toHaveLength(1);
    expect(screen.getByText('0')).toBeInTheDocument();
  });
});
