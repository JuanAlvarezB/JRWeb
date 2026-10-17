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

| Script                              | Descripción                                           |
| ----------------------------------- | ----------------------------------------------------- |
| `dev`                               | Genera los tokens y abre el servidor de desarrollo    |
| `tokens`                            | Genera `variables.css` desde `design-tokens/`         |
| `tokens:check`                      | Falla si las variables generadas se editaron a mano   |
| `build:qa` / `build:production`     | Build del ambiente + `robots.txt` y `_headers`        |
| `preview:qa` / `preview:production` | Build y vista previa local en <http://localhost:4173> |
| `typecheck`                         | TypeScript estricto                                   |
| `lint`                              | Tokens + ESLint + Stylelint + Prettier                |
| `format`                            | Formatea todo con Prettier                            |

## Stack

React 19 · Vite 8 · TypeScript 6 (estricto) · React Router 8 · TanStack Query · Zod · CSS Modules + variables de Style Dictionary · Vitest + Testing Library · Playwright + axe · Cloudflare Pages · GitHub Actions.

> **Versiones:** TypeScript 7 y ESLint 10 ya existen, pero `typescript-eslint` aún no soporta TypeScript 7, y `eslint-plugin-react` y `eslint-plugin-jsx-a11y` aún no soportan ESLint 10. Por eso el proyecto usa TypeScript 6.0 y ESLint 9.39. Dependabot propondrá la actualización cuando sea compatible.

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

**Catálogo de componentes:** con `npm run dev`, <http://localhost:5173> muestra cada componente (botones, links, franja, encabezados, tarjetas, acordeón, velocímetro, aguada e íconos) con datos de los mockups. Solo existe en DEV: Vite lo elimina de las builds de QA y PDN.

Los mockups aprobados están en [`docs/mockups/`](docs/mockups/) (390 y 1440 px; en `con-flotantes/`, con el botón de WhatsApp y el aviso de privacidad).

## Documentación

| Documento                                                      | Contenido                                                        |
| -------------------------------------------------------------- | ---------------------------------------------------------------- |
| [`docs/instalacion-local.md`](docs/instalacion-local.md)       | Instalación en macOS y comandos                                  |
| [`docs/configuracion-github.md`](docs/configuracion-github.md) | Rulesets, environments, seguridad, Azure Boards y flujo de ramas |

Se completa en cada etapa: ambientes y despliegue, GitHub, Cloudflare, guía para actualizar contenido y checklist de QA.
