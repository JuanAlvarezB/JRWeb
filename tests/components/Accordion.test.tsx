import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Accordion } from '@/presentation/components/ui/Accordion/Accordion';

function renderFaq(): void {
  render(
    <Accordion defaultOpen={['edad']}>
      <Accordion.Item id="edad">
        <Accordion.Trigger>¿Desde qué edad puedo hacer el curso?</Accordion.Trigger>
        <Accordion.Panel>
          <p>Desde los 16 años.</p>
        </Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item id="precio">
        <Accordion.Trigger>¿Cuánto cuesta el curso?</Accordion.Trigger>
        <Accordion.Panel>
          <p>Escríbenos por WhatsApp.</p>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>,
  );
}

describe('Accordion', () => {
  it('abre los elementos indicados al cargar', () => {
    renderFaq();
    expect(screen.getByRole('button', { name: /desde qué edad/i })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    expect(screen.getByText('Desde los 16 años.')).toBeVisible();
    expect(screen.queryByText('Escríbenos por WhatsApp.')).not.toBeVisible();
  });

  it('permite varios elementos abiertos a la vez', async () => {
    const user = userEvent.setup();
    renderFaq();
    await user.click(screen.getByRole('button', { name: /cuánto cuesta/i }));
    expect(screen.getByText('Desde los 16 años.')).toBeVisible();
    expect(screen.getByText('Escríbenos por WhatsApp.')).toBeVisible();
  });

  it('se abre y cierra con el teclado', async () => {
    const user = userEvent.setup();
    renderFaq();
    const trigger = screen.getByRole('button', { name: /cuánto cuesta/i });
    trigger.focus();
    await user.keyboard('{Enter}');
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await user.keyboard(' ');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('enlaza cada pregunta con su respuesta', () => {
    renderFaq();
    const trigger = screen.getByRole('button', { name: /desde qué edad/i });
    const panelId = trigger.getAttribute('aria-controls');
    expect(panelId).not.toBeNull();
    expect(document.getElementById(panelId ?? '')).toHaveTextContent('Desde los 16 años.');
  });
});
