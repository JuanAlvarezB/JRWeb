import { test as base, expect } from '@playwright/test';
import { SitePage } from '../pages/SitePage';

interface Fixtures {
  /** Page Object del sitio, con los errores de consola registrados desde la carga. */
  readonly site: SitePage;
}

/** `test` del proyecto: igual al de Playwright más el fixture `site`. */
export const test = base.extend<Fixtures>({
  site: async ({ page }, provide) => {
    await provide(new SitePage(page));
  },
});

export { expect };
