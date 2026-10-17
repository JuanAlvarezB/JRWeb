import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import { ActionLink } from '@/presentation/components/ui/ActionLink';
import { Button } from '@/presentation/components/ui/Button';

describe('Button', () => {
  it('con href es un enlace externo', () => {
    render(
      <Button href="https://wa.me/573165641048" icon="whatsapp">
        Escríbenos por WhatsApp
      </Button>,
    );
    expect(screen.getByRole('link', { name: 'Escríbenos por WhatsApp' })).toHaveAttribute(
      'href',
      'https://wa.me/573165641048',
    );
  });

  it('anuncia cuando abre una pestaña nueva', () => {
    render(
      <Button href="https://maps.app.goo.gl/x" newTab>
        Cómo llegar
      </Button>,
    );
    const link = screen.getByRole('link', { name: /cómo llegar.*pestaña nueva/i });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('con onClick es un botón', async () => {
    const onClick = vi.fn();
    render(
      <Button variant="outline" onClick={onClick}>
        Ver mapa
      </Button>,
    );
    await userEvent.setup().click(screen.getByRole('button', { name: 'Ver mapa' }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('con to navega dentro del sitio', () => {
    render(
      <MemoryRouter>
        <ActionLink to="/planes">Ver planes</ActionLink>
      </MemoryRouter>,
    );
    expect(screen.getByRole('link', { name: 'Ver planes' })).toHaveAttribute('href', '/planes');
  });
});
