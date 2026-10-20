import { test as base, expect } from '@playwright/test';
import { ContactPage } from '../pages/ContactPage';
import { DataPolicyPage } from '../pages/DataPolicyPage';
import { FaqPage } from '../pages/FaqPage';
import { HomePage } from '../pages/HomePage';
import { PlansPage } from '../pages/PlansPage';
import { SitePage } from '../pages/SitePage';

interface Fixtures {
  /** Page Object del sitio, con los errores de consola registrados desde la carga. */
  readonly site: SitePage;
  readonly home: HomePage;
  readonly plans: PlansPage;
  readonly contact: ContactPage;
  readonly faq: FaqPage;
  readonly policy: DataPolicyPage;
}

/** `test` del proyecto: igual al de Playwright más un Page Object por página. */
export const test = base.extend<Fixtures>({
  site: async ({ page }, provide) => {
    await provide(new SitePage(page));
  },
  home: async ({ page }, provide) => {
    await provide(new HomePage(page));
  },
  plans: async ({ page }, provide) => {
    await provide(new PlansPage(page));
  },
  contact: async ({ page }, provide) => {
    await provide(new ContactPage(page));
  },
  faq: async ({ page }, provide) => {
    await provide(new FaqPage(page));
  },
  policy: async ({ page }, provide) => {
    await provide(new DataPolicyPage(page));
  },
});

export { expect };
