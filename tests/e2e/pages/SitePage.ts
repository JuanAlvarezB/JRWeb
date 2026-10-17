import type { Page } from '@playwright/test';

/**
 * Page Object base: navegación y señales comunes a todas las páginas.
 * Los Page Objects de cada página (Inicio, Planes, Contáctanos…) lo extenderán.
 */
export class SitePage {
  readonly consoleErrors: string[] = [];

  constructor(readonly page: Page) {
    page.on('console', (message) => {
      if (message.type() !== 'error') return;
      // La 404 responde con estado 404 a propósito: no es un error de la página.
      const isDocument404 = message.text().includes('404') && message.location().url === page.url();
      if (!isDocument404) this.consoleErrors.push(message.text());
    });
    page.on('pageerror', (error) => {
      this.consoleErrors.push(error.message);
    });
  }

  async goto(path: string): Promise<void> {
    await this.page.goto(path);
  }

  documentLanguage(): Promise<string | null> {
    return this.page.locator('html').getAttribute('lang');
  }

  mainHeading(): ReturnType<Page['getByRole']> {
    return this.page.getByRole('heading', { level: 1 });
  }
}
