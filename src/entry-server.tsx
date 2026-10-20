/**
 * Build del servidor para el prerender (`vite build --ssr src/entry-server.tsx`).
 * `scripts/prerender.ts` la usa para generar el HTML estático de cada página con
 * React 19 (`react-dom/static`), sin dependencias extra. Nunca llega al navegador.
 */
import { prerender } from 'react-dom/static';
import { StaticRouter } from 'react-router';
import { AppContent } from './App';
import { createContainer } from './di/container';
import { AppProviders } from './presentation/providers/AppProviders';
import { createQueryClient } from './presentation/providers/queryClient';
import { serializeQueryState } from './presentation/providers/queryState';
import { renderHeadTags } from './presentation/seo/headTags';
import { pageMeta } from './presentation/seo/pageMeta';
import { PAGE_KEY_BY_PATH, PRERENDER_TARGETS } from './presentation/seo/prerenderTargets';
import { drivingSchoolJsonLd, faqPageJsonLd, type JsonLd } from './presentation/seo/structuredData';
import type { AppDependencies } from './presentation/providers/AppDependencies';
import { appConfig } from './shared/config/env';
import type { PrerenderedPage } from './shared/prerender';

export { PRERENDER_TARGETS };

async function readStream(stream: ReadableStream<Uint8Array>): Promise<string> {
  return new Response(stream).text();
}

/** Datos estructurados de cada página: la escuela en Inicio y Contáctanos; FAQPage en Preguntas. */
async function structuredDataFor(path: string, deps: AppDependencies): Promise<JsonLd[]> {
  const key = PAGE_KEY_BY_PATH[path];
  if (key === 'faq') return [faqPageJsonLd(await deps.listFaqs.execute())];
  if (key !== 'home' && key !== 'contact') return [];
  const [company, location, channels, plans] = await Promise.all([
    deps.getCompanyInfo.execute(),
    deps.getLocation.execute(),
    deps.listContactChannels.execute(),
    deps.listPlans.execute(),
  ]);
  return [drivingSchoolJsonLd({ company, location, channels, plans })];
}

/**
 * Renderiza una página completa: espera las páginas diferidas y las consultas
 * (Suspense), y devuelve el HTML, el `<head>` y la caché de consultas.
 *
 * @throws {Error} Si la página falla al renderizar o el HTML trae scripts en línea
 *   (la build se detiene).
 */
export async function renderPage(path: string): Promise<PrerenderedPage> {
  const key = PAGE_KEY_BY_PATH[path];
  if (key === undefined) throw new Error(`Ruta sin metadatos de SEO: ${path}`);

  const dependencies = createContainer();
  const queryClient = createQueryClient();
  const errors: unknown[] = [];
  const render = async (): Promise<string> => {
    const { prelude } = await prerender(
      <AppProviders dependencies={dependencies} queryClient={queryClient}>
        <StaticRouter location={path}>
          <AppContent />
        </StaticRouter>
      </AppProviders>,
      {
        // Sin límite de tamaño: React no saca los bloques grandes del flujo (lo haría
        // con un <script> en línea para completarlos, y la CSP lo bloquea).
        progressiveChunkSize: Number.POSITIVE_INFINITY,
        onError(error) {
          errors.push(error);
        },
      },
    );
    return readStream(prelude);
  };

  // 1.er render: carga las páginas diferidas y llena la caché de consultas. Lo que
  // se suspende ahí React lo completa con <script> en línea, que la CSP bloquea.
  // 2.º render: ya nada se suspende y el HTML sale completo, sin scripts.
  await render();
  const html = await render();
  if (errors.length > 0) {
    throw new Error(`No se pudo prerenderizar ${path}: ${String(errors[0])}`);
  }
  if (html.includes('<script')) {
    throw new Error(`El HTML de ${path} tiene <script> en línea: la CSP lo bloquearía.`);
  }

  const head = renderHeadTags(pageMeta(key), {
    indexingAllowed: appConfig.isProduction,
    jsonLd: await structuredDataFor(path, dependencies),
  });
  return { html, head, state: serializeQueryState(queryClient) };
}
