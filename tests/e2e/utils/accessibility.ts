import AxeBuilder from '@axe-core/playwright';
import type { Page } from '@playwright/test';

/** Reglas WCAG 2.1 A y AA (DESIGN.md y requisitos no funcionales). */
const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

/** Devuelve las violaciones de accesibilidad de la página, resumidas para el reporte. */
export async function findAccessibilityViolations(page: Page): Promise<string[]> {
  const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
  return results.violations.map(
    (violation) => `${violation.id} (${violation.impact ?? 'sin impacto'}): ${violation.help}`,
  );
}
