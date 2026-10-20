import { defineConfig, devices } from '@playwright/test';

/**
 * Pruebas end-to-end con Playwright.
 *
 * - Sin `BASE_URL`: sirve `dist/` con `scripts/serve-dist.ts`, que aplica las reglas de
 *   Cloudflare Pages (rutas, 404, `_headers` con la CSP y compresión).
 * - Con `BASE_URL`: prueba un sitio ya publicado (QA o PDN). Si existen
 *   `CF_ACCESS_CLIENT_ID` y `CF_ACCESS_CLIENT_SECRET`, se envían como encabezados
 *   del Service Token de Cloudflare Access (solo QA). Nunca se escriben en el repo.
 *
 * Proyectos: regresión en Chromium, Firefox, WebKit y móvil; `smoke` (PDN) y `visual`.
 */
const isCI = process.env.CI !== undefined;
const externalBaseUrl = process.env.BASE_URL;
const baseURL = externalBaseUrl ?? 'http://localhost:4173';
const accessClientId = process.env.CF_ACCESS_CLIENT_ID;
const accessClientSecret = process.env.CF_ACCESS_CLIENT_SECRET;
const accessHeaders =
  accessClientId !== undefined && accessClientSecret !== undefined
    ? { 'CF-Access-Client-Id': accessClientId, 'CF-Access-Client-Secret': accessClientSecret }
    : undefined;

const REGRESSION_DIR = 'tests/e2e/specs/regression';

export default defineConfig({
  testDir: 'tests/e2e/specs',
  outputDir: 'test-results',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  ...(isCI ? { workers: 2 } : {}),
  reporter: isCI
    ? [['list'], ['github'], ['html', { open: 'never', outputFolder: 'playwright-report' }]]
    : [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]],
  use: {
    baseURL,
    locale: 'es-CO',
    timezoneId: 'America/Bogota',
    ...(accessHeaders === undefined ? {} : { extraHTTPHeaders: accessHeaders }),
    // Trazas, capturas y video solo cuando una prueba falla.
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  expect: {
    toHaveScreenshot: { animations: 'disabled', maxDiffPixelRatio: 0.02 },
  },
  projects: [
    { name: 'chromium', testDir: REGRESSION_DIR, use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', testDir: REGRESSION_DIR, use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', testDir: REGRESSION_DIR, use: { ...devices['Desktop Safari'] } },
    { name: 'mobile', testDir: REGRESSION_DIR, use: { ...devices['Pixel 7'] } },
    { name: 'smoke', testDir: 'tests/e2e/specs/smoke', use: { ...devices['Desktop Chrome'] } },
    {
      name: 'visual',
      testDir: 'tests/e2e/specs/visual',
      use: { ...devices['Desktop Chrome'], contextOptions: { reducedMotion: 'reduce' } },
    },
  ],
  ...(externalBaseUrl === undefined
    ? {
        webServer: {
          command: 'npx tsx scripts/serve-dist.ts --port 4173',
          url: baseURL,
          reuseExistingServer: !isCI,
          timeout: 60_000,
        },
      }
    : {}),
});
