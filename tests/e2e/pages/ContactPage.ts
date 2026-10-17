import type { Locator } from '@playwright/test';
import { SitePage } from './SitePage';

/** Contáctanos: canales, ubicación con mapa y horarios. */
export class ContactPage extends SitePage {
  async open(): Promise<void> {
    await this.goto('/contactanos');
  }

  /** Tarjeta de un canal por su etiqueta ("WhatsApp", "Correo"…). */
  channelCard(label: string): Locator {
    return this.main().getByRole('listitem').filter({ hasText: label }).first();
  }

  copyButton(value: string): Locator {
    return this.page.getByRole('button', { name: `Copiar ${value}` });
  }

  copyStatus(): Locator {
    return this.page.getByRole('status');
  }

  showMapButton(): Locator {
    return this.page.getByRole('button', { name: 'Ver mapa' });
  }

  mapFrame(): Locator {
    return this.page.locator('iframe[title^="Mapa de"]');
  }

  directionsLink(): Locator {
    return this.page.getByRole('link', { name: /^Cómo llegar/u });
  }

  wazeLink(): Locator {
    return this.page.getByRole('link', { name: /^Abrir en Waze/u });
  }

  schedules(): Locator {
    return this.page.locator('#horarios');
  }
}
