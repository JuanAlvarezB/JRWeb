import type { Locator, Page } from '@playwright/test';

/** Número principal de WhatsApp (contact.json): todos los botones lo usan. */
export const WHATSAPP_NUMBER = '573165641048';

/**
 * Page Object base: navegación y elementos comunes a todas las páginas (menú,
 * menú móvil, aviso de privacidad, botón flotante y footer). Los de cada página lo
 * extienden.
 */
export class SitePage {
  /** Errores de consola y de la página, con la URL que los originó (vacía si no hay). */
  private readonly errors: { readonly text: string; readonly url: string }[] = [];

  constructor(readonly page: Page) {
    page.on('console', (message) => {
      if (message.type() === 'error') {
        this.errors.push({ text: message.text(), url: message.location().url });
      }
    });
    page.on('pageerror', (error) => {
      this.errors.push({ text: error.message, url: '' });
    });
  }

  /** Todos los errores de consola y de la página desde la carga. */
  get consoleErrors(): string[] {
    return this.errors.map((error) => error.text);
  }

  /**
   * Errores de consola salvo el aviso del propio documento 404 de `path`. La 404 responde
   * con estado HTTP 404 a propósito (Cloudflare Pages y serve-dist), y Chromium y WebKit
   * lo anotan en la consola ("Failed to load resource: … status of 404"). En WebKit el
   * aviso puede llegar antes de que `page.url()` cambie, así que se compara con la ruta
   * navegada. Cualquier otro error, incluido un 404 de otro recurso, se conserva.
   */
  consoleErrorsIgnoringDocument404(path: string): string[] {
    return this.errors
      .filter(
        (error) =>
          !(
            error.text.includes('status of 404') &&
            URL.canParse(error.url) &&
            new URL(error.url).pathname === path
          ),
      )
      .map((error) => error.text);
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
