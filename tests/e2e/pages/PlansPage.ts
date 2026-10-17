import type { Locator } from '@playwright/test';
import { SitePage } from './SitePage';

/** Planes: tarjetas con desglose de horas y preguntas sobre los planes. */
export class PlansPage extends SitePage {
  async open(): Promise<void> {
    await this.goto('/planes');
  }

  /** Tarjeta de un plan por su nombre ("Licencia B1"). */
  planCard(name: string): Locator {
    return this.main()
      .getByRole('listitem')
      .filter({ has: this.page.getByRole('heading', { level: 3, name }) });
  }

  priceLink(name: string): Locator {
    return this.planCard(name).getByRole('link', { name: /^Consultar precio/u });
  }

  requirementsLink(name: string): Locator {
    return this.planCard(name).getByRole('link', { name: /^Consultar requisitos/u });
  }

  question(text: string): Locator {
    return this.page.getByRole('button', { name: text });
  }
}
