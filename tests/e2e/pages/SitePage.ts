import type { Locator, Page } from '@playwright/test';

/** Número principal de WhatsApp (contact.json): todos los botones lo usan. */
export const WHATSAPP_NUMBER = '573165641048';

/**
 * Page Object base: navegación y elementos comunes a todas las páginas (menú,
 * menú móvil, aviso de privacidad, botón flotante y footer). Los de cada página lo
 * extienden.
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

  /**
   * Abre una ruta y espera a que React hidrate el HTML prerenderizado: antes de eso
   * la página se ve completa pero los botones aún no responden.
   */
  async goto(path: string): Promise<void> {
    await this.page.goto(path);
    await this.waitForHydration();
  }

  /** Espera la marca `<html data-hydrated>` (`useHydrationMarker`). */
  async waitForHydration(): Promise<void> {
    await this.page.locator('html[data-hydrated]').waitFor({ state: 'attached' });
  }

  /** Marca el aviso de privacidad como leído antes de cargar (capturas y flujos sin él). */
  async skipPrivacyNotice(): Promise<void> {
    await this.page.addInitScript(() => {
      localStorage.setItem('aviso-privacidad', 'visto');
    });
  }

  documentLanguage(): Promise<string | null> {
    return this.page.locator('html').getAttribute('lang');
  }

  mainHeading(): Locator {
    return this.page.getByRole('heading', { level: 1 });
  }

  main(): Locator {
    return this.page.locator('main#contenido');
  }

  /** Menú principal de la barra (visible desde ~1000 px de ancho). */
  mainNav(): Locator {
    return this.page
      .getByRole('banner')
      .getByRole('navigation', { name: 'Navegación principal' })
      .first();
  }

  menuButton(): Locator {
    return this.page.getByRole('button', { name: 'Abrir menú' });
  }

  mobileMenu(): Locator {
    return this.page.getByRole('dialog', { name: 'Menú' });
  }

  privacyNotice(): Locator {
    return this.page.getByRole('region', { name: 'Aviso de privacidad' });
  }

  /** Botón flotante de WhatsApp. */
  floatingWhatsApp(): Locator {
    return this.page
      .getByRole('link', { name: 'Escríbenos por WhatsApp (se abre en una pestaña nueva)' })
      .last();
  }

  footer(): Locator {
    return this.page.getByRole('contentinfo');
  }

  /** Mensaje prellenado de un enlace de WhatsApp (`?text=`). */
  static async whatsAppMessage(link: Locator): Promise<string | null> {
    const href = await link.getAttribute('href');
    if (href === null) return null;
    const url = new URL(href);
    return url.hostname === 'wa.me' ? url.searchParams.get('text') : null;
  }

  /** Número de un enlace de WhatsApp (`wa.me/<número>`). */
  static async whatsAppNumber(link: Locator): Promise<string | null> {
    const href = await link.getAttribute('href');
    return href === null ? null : new URL(href).pathname.slice(1);
  }
}
