import type { Locator } from '@playwright/test';
import { SitePage } from './SitePage';

/** Política de Tratamiento de Datos: índice y secciones. */
export class DataPolicyPage extends SitePage {
  async open(): Promise<void> {
    await this.goto('/politica-de-tratamiento-de-datos');
  }

  index(): Locator {
    return this.page.getByRole('navigation', { name: 'Índice' });
  }

  indexLink(title: string): Locator {
    return this.index().getByRole('link', { name: title });
  }

  section(id: string): Locator {
    return this.page.locator(`[id="${id}"]`);
  }
}
