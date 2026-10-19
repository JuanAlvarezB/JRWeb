# Conducir J&R del Sinú · Sitio web

Sitio informativo del Centro de Enseñanza Automovilística **Conducir J&R del Sinú** (Cereté, Córdoba). Release 1: misión y visión, servicios, planes sin precios, contacto, ubicación, preguntas frecuentes y política de tratamiento de datos. Sin base de datos, formularios ni pagos.

- **Diseño:** [`DESIGN.md`](DESIGN.md) es la fuente de verdad visual. Todo cambio de diseño empieza por ese archivo.
- **Ambientes:** DEV (tu equipo) → QA (privado) → PDN (público).

## Inicio rápido

```bash
npm ci
npm run dev        # http://localhost:5173
```

Instalación completa en macOS: [`docs/instalacion-local.md`](docs/instalacion-local.md).

## Scripts

| Script                              | Descripción                                                                                         |
| ----------------------------------- | --------------------------------------------------------------------------------------------------- |
| `dev`                               | Genera los tokens y abre el servidor de desarrollo                                                  |
| `tokens`                            | Genera `variables.css` desde `design-tokens/`                                                       |
| `tokens:check`                      | Falla si las variables generadas se editaron a mano                                                 |
| `build:qa` / `build:production`     | Build del ambiente, prerender de las páginas, `robots.txt`, `_headers` (y `sitemap.xml` en PDN)     |
| `preview:qa` / `preview:production` | Build y vista previa local en <http://localhost:4173>, con las reglas de Cloudflare Pages           |
| `serve`                             | Sirve el `dist/` actual como Cloudflare Pages (sin volver a construir)                              |
| `typecheck`                         | TypeScript estricto                                                                                 |
| `lint`                              | Tokens + ESLint + Stylelint + Prettier                                                              |
| `format`                            | Formatea todo con Prettier                                                                          |
| `content:validate`                  | Esquemas del contenido, coherencia entre archivos, sin precios y política de datos aprobada         |
| `test`                              | Unitarias, componentes, build de QA, e2e (4 navegadores) y visuales: lo que conviene antes de un PR |
| `test:e2e:qa` / `test:e2e:smoke`    | Regresión contra QA publicado (requiere el Service Token) y smoke contra PDN                        |

## Stack

React 19 · Vite 8 · TypeScript 6 (estricto) · React Router 8 · TanStack Query · Zod · CSS Modules + variables de Style Dictionary · Vitest + Testing Library · Playwright + axe · Cloudflare Pages · GitHub Actions.

> **Versiones:** TypeScript 7 y ESLint 10 ya existen, pero `typescript-eslint` aún no soporta TypeScript 7, y `eslint-plugin-react` y `eslint-plugin-jsx-a11y` aún no soportan ESLint 10. Por eso el proyecto usa TypeScript 6.0 y ESLint 9.39. Cuándo aceptar una versión mayor: [`docs/configuracion-github.md`](docs/configuracion-github.md), paso 6.2.

## Arquitectura

Arquitectura limpia con la regla de dependencias `presentation -> domain <- data`, verificada por ESLint (`no-restricted-imports`):

| Capa         | Carpeta               | Puede importar                                      |
| ------------ | --------------------- | --------------------------------------------------- |
| Dominio      | `src/domain/`         | Solo el dominio. Sin React ni librerías externas.   |
| Datos        | `src/data/`           | Dominio y `shared/`. Sin React.                     |
| Presentación | `src/presentation/`   | Dominio y `shared/`. Nunca `data/` ni `di/`.        |
| Composición  | `src/di/container.ts` | Todo: es el único lugar que instancia repositorios. |
| Transversal  | `src/shared/`         | Sin dependencias de capas superiores.               |

Flujo de datos: componente → hook → caso de uso → contrato del repositorio → implementación en `data/`.

### Inyección de dependencias

- **`src/di/container.ts`** (composition root): `createStaticRepositories()` crea un repositorio por contrato del dominio y `createContainer(repositories)` construye los casos de uso con ellos.
- **`main.tsx`** llama a `createContainer()` y pasa el resultado a `<App>`.
- **`AppProviders`** monta dos providers:
  - **`QueryProvider`**: caché de TanStack Query. El contenido es estático, así que una consulta resuelta no se vuelve a pedir. Los errores del dominio no se reintentan; las fallas de red, hasta 2 veces.
  - **`DependencyProvider`**: entrega los casos de uso por Context. Solo los hooks de datos llaman a `useDependencies()`.
- **`AppDependencies`** (en `presentation/providers/`) es el contrato: la presentación declara qué casos de uso necesita y el contenedor los entrega.
- **Pruebas:** usan `createContainer(inMemoryRepositories())`, con repositorios en memoria y sin archivos.

### Hooks de datos (`presentation/hooks/`)

Los componentes solo usan estos hooks:

| Hook                                    | Devuelve                                                    |
| --------------------------------------- | ----------------------------------------------------------- |
| `useCompanyInfo()`                      | Razón social, NIT, misión, visión y diferenciadores         |
| `useServices()` / `usePlans()`          | Cursos y planes en orden A2, B1, C1 (sin precios)           |
| `useSchedule()`                         | Horarios teóricos y prácticos                               |
| `useFaqs({ page })` / `useFaqGroups()`  | Preguntas de una página, o agrupadas por tema               |
| `useTestimonials()`                     | Calificación de Google y opiniones                          |
| `useDataPolicy()`                       | Política con sus secciones (se descarga solo en su página)  |
| `useContactChannels(kinds?)`            | Canales con enlaces listos (`tel:`, `mailto:`, WhatsApp…)   |
| `useWhatsAppLink({ topic, category }?)` | Enlace de WhatsApp con el mensaje general o de la consulta  |
| `useSchoolLocation()`                   | Ubicación con dirección en una línea y enlace "Cómo llegar" |

- **Suspense:** usan `useSuspenseQuery`, así que el componente siempre recibe los datos. La carga la muestra un `<Suspense>` y los errores, el Error Boundary de cada página.
- **Claves y consultas:** las definiciones de `queries.ts` son la única fuente. El prerender guarda la caché de TanStack Query en el HTML y el navegador hidrata con ella, sin repetir consultas.
- **Lógica de enlaces:** las funciones puras de `contactLinks.ts` y `shared/utils/links.ts` arman los enlaces, y se prueban sin React.

### Páginas y layout

- **Rutas** (`presentation/router/AppRoutes.tsx`): una por página, cada una en un fragmento aparte (carga diferida). El prerender usa la misma definición.
- **Layout** (`presentation/components/layout/`):
  - Menú fijo de 124 → 72 px al hacer scroll. Usa ☰ cuando los enlaces no caben (celular y pantallas de menos de unos 1240 px).
  - Menú móvil con `<dialog>`: atrapa el foco y se cierra con Esc.
  - Footer, botón flotante de WhatsApp y aviso de privacidad. El aviso se recuerda en `localStorage` con try/catch.
  - Etiqueta "QA" solo en QA.
  - "Saltar al contenido".
- **Error Boundary por página:** si una página falla, el menú y el footer siguen funcionando.
- **Al cambiar de página:** la vista vuelve arriba (o al ancla, p. ej. `/contactanos#horarios`) y el foco pasa al contenido.

### SEO, prerender y analítica

- **Prerender:** `npm run build:qa` y `build:production` generan una página HTML por ruta (`index.html`, `planes.html`, … y `404.html`) con React 19 (`react-dom/static`) desde `src/entry-server.tsx`, sin dependencias extra.
- **HTML generado:** cada página trae su contenido completo, sus metadatos y la caché de consultas. Cloudflare Pages sirve `planes.html` en `/planes`.
- **Hidratación:** el navegador hidrata ese HTML; en DEV la aplicación se monta desde cero.
- **Metadatos** (`presentation/seo/`):
  - título, descripción y canónica (siempre PDN) para buscadores;
  - vistas previas al compartir (WhatsApp, Facebook, LinkedIn y X): Open Graph y tarjeta de X con título propio, descripción de máx. 80 caracteres e imagen `public/og-image.png` (1200 × 630, máx. 250 KB). Las construye `socialTags()` en `headTags.ts`; los textos están en `UI_TEXT.seo.share`;
  - JSON-LD `DrivingSchool` en Inicio y Contáctanos, y `FAQPage` en Preguntas frecuentes, sin precios ni calificación;
  - al navegar dentro del sitio, `usePageMeta` actualiza el título y la canónica.
- **Indexación:** solo PDN se indexa; QA y la 404 llevan `noindex`. `sitemap.xml` solo en PDN.
- **Analítica:** el beacon de Cloudflare Web Analytics se agrega solo en PDN y solo si existe `VITE_CF_ANALYTICS_TOKEN`. No usa cookies.
- **Sin scripts en línea:** el prerender falla si el HTML trae `<script>` en línea, porque la CSP los bloquea.
- **Servidor local** (`scripts/serve-dist.ts`): las pruebas e2e usan un servidor con las reglas de Cloudflare Pages: URL sin `.html`, 404 con estado 404, `_redirects`, `_headers` con la CSP y compresión. Así detectan problemas de CSP antes de publicar.

### Cambiar la fuente de datos (fase 2: Supabase)

Solo se crean repositorios nuevos en `data/` y se modifica `src/di/container.ts`. Dominio, hooks y componentes no cambian. Ejemplo con los planes:

```ts
// src/data/repositories/SupabasePlanRepository.ts
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Plan } from '../../domain/entities/Plan';
import type { PlanRepository } from '../../domain/repositories/PlanRepository';
import { mapPlans } from '../mappers/plansMapper';

export class SupabasePlanRepository implements PlanRepository {
  constructor(private readonly db: SupabaseClient) {}

  async list(): Promise<readonly Plan[]> {
    const { data, error } = await this.db.from('plans').select('*');
    if (error) throw error; // falla técnica: TanStack Query la reintenta
    return mapPlans(data); // mismo esquema Zod y mismas reglas del dominio
  }
}
```

```ts
// src/di/container.ts
import { createSupabaseClient } from '@/data/supabase/client'; // URL y llave pública desde env

export function createSupabaseRepositories(db: SupabaseClient): Repositories {
  return {
    ...createStaticRepositories(), // lo que siga siendo estático (empresa, política…)
    plans: new SupabasePlanRepository(db),
  };
}

export function createContainer(
  repositories: Repositories = createSupabaseRepositories(createSupabaseClient()),
): AppDependencies {
  /* sin cambios */
}
```

La migración puede hacerse repositorio por repositorio. Si una columna de la tabla tiene otro nombre que el campo del JSON, el ajuste va en el mapper.

## Sistema de diseño

1. **[`DESIGN.md`](DESIGN.md)**: reglas, roles de cada color y componente, y registro de cambios.
2. **`design-tokens/tokens.json`** (sistema, exportado de Claude Design) y **`design-tokens/components.json`** (medidas de componentes del handoff).
3. **`npm run tokens`** → `src/styles/variables.css` (CSS) y `src/shared/constants/designTokens.ts` (los pocos valores que usa JavaScript). Ambos archivos son generados: no se editan a mano.
4. Los CSS Modules solo usan variables. Stylelint rechaza colores, tamaños y familias de fuente, pesos, sombras y radios literales; variables inexistentes, y cualquier punto de quiebre distinto de 720 px.

**Sitio en DEV:** con `npm run dev`, <http://localhost:5173> muestra el sitio completo con el contenido real.

**Catálogo de componentes:** <http://localhost:5173/dev/componentes> muestra cada componente base (botones, links, franja, encabezados, tarjetas, acordeón, velocímetro, aguada e íconos) con datos de los mockups. Solo existe en DEV: Vite lo elimina de las builds de QA y PDN.

Los mockups aprobados están en [`docs/mockups/`](docs/mockups/) (390 y 1440 px; en `con-flotantes/`, con el botón de WhatsApp y el aviso de privacidad).

## Documentación

| Documento                                                                        | Contenido                                                                         |
| -------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| [`docs/instalacion-local.md`](docs/instalacion-local.md)                         | Instalación en macOS y comandos                                                   |
| [`docs/configuracion-github.md`](docs/configuracion-github.md)                   | Rulesets, environments, seguridad, Azure Boards y flujo de ramas                  |
| [`docs/configuracion-cloudflare.md`](docs/configuracion-cloudflare.md)           | Cloudflare Pages, Access, Service Token, Web Analytics, revertir y dominio propio |
| [`docs/ambientes-y-despliegue.md`](docs/ambientes-y-despliegue.md)               | Pipeline, pruebas y cómo llevar un cambio de DEV a QA y a PDN                     |
| [`docs/guia-actualizar-contenido.md`](docs/guia-actualizar-contenido.md)         | Cambiar teléfonos, horarios, horas, preguntas, opiniones y demás datos            |
| [`docs/checklist-pruebas-manuales-qa.md`](docs/checklist-pruebas-manuales-qa.md) | Revisión manual de QA antes de publicar en PDN                                    |
| [`docs/estado-del-proyecto.md`](docs/estado-del-proyecto.md)                     | Etapas terminadas y etapas que faltan                                             |
| [`docs/pendientes.md`](docs/pendientes.md)                                       | Pendientes abiertos y resueltos                                                   |
