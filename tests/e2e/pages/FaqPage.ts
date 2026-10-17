import type { Locator } from '@playwright/test';
import { SitePage } from './SitePage';

/** Preguntas frecuentes: acordeón agrupado por tema. */
export class FaqPage extends SitePage {
  async open(): Promise<void> {
    await this.goto('/preguntas-frecuentes');
  }

  topic(name: string): Locator {
    return this.main().getByRole('heading', { level: 2, name, exact: true });
  }

  question(text: string): Locator {
    return this.page.getByRole('button', { name: text });
  }

  /** Respuesta de una pregunta (panel que controla su botón). */
  async answer(text: string): Promise<Locator> {
    const panelId = await this.question(text).getAttribute('aria-controls');
    return this.page.locator(`[id="${panelId ?? ''}"]`);
  }
}
