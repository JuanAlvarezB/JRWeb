import type { Page } from '@playwright/test';

/**
 * Page Object base: navegación y señales comunes a todas las páginas.
 * Los Page Objects de cada página (Inicio, Planes, Contáctanos…) lo extenderán.
 */
export class SitePage {
  readonly consoleErrors: string[] = [];

  constructor(readonly page: Page) {
    page.on('console', (message) => {
      if (message.type() === 'error') this.consoleErrors.push(message.text());
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
