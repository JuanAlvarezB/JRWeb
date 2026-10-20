import type { Locator } from '@playwright/test';
import { SitePage } from './SitePage';

/** Inicio: hero, "Tu curso en horas" y secciones de resumen. */
export class HomePage extends SitePage {
  async open(): Promise<void> {
    await this.goto('/');
  }

  heroWhatsApp(): Locator {
    return this.main()
      .getByRole('link', { name: /^Escríbenos por WhatsApp/u })
      .first();
  }

  courseCategory(category: 'A2' | 'B1' | 'C1'): Locator {
    return this.page.getByRole('radio', { name: category });
  }

  /** Nombre del plan mostrado en "Tu curso en horas". */
  courseTitle(): Locator {
    return this.page.getByRole('radiogroup').locator('xpath=..').getByRole('heading', { level: 3 });
  }

  /** Horas de un tramo en la leyenda ("Teoría", "Taller", "Manejo"). */
  courseHours(label: 'Teoría' | 'Taller' | 'Manejo'): Locator {
    return this.page
      .getByRole('listitem')
      .filter({ hasText: label })
      .filter({ hasText: /horas$/u })
      .first();
  }

  courseArc(): Locator {
    return this.page.getByRole('img', { name: /horas en total/u }).last();
  }

  courseRequirementsLink(): Locator {
    return this.page.getByRole('link', { name: /Consulta los requisitos por WhatsApp/u });
  }
}
