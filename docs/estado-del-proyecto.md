# Estado del proyecto

Sitio web de Conducir J&R del Sinú: etapas terminadas y etapas que faltan.

Actualizado el 18 oct 2026, al cerrar la etapa 13 (documentación).

## Resumen

- **Hecho:**
  - El sitio está completo: 8 páginas con contenido real que cumplen DESIGN.md y los mockups.
  - Cada página se genera como HTML estático con SEO y datos estructurados.
  - Rendimiento medido en Lighthouse: 98–100.
  - El CI de GitHub valida cada PR hacia `qa`, con pruebas de cada página y de cada flujo en 4 navegadores.
  - Cloudflare está configurado: cada integración en `qa` publica QA (privado, con Access) y corre la regresión contra el sitio real.
  - Documentación completa: instalación, GitHub, Cloudflare, despliegue, actualización de contenido y checklist de QA.
- **Falta para publicar:** revisar QA con el checklist y llevar `qa` a `main` (etapa 14).

| Rama   | Estado                                                                |
| ------ | --------------------------------------------------------------------- |
| `qa`   | Etapas 1–12 integradas; la 13 en su PR.                               |
| `main` | Solo el primer commit. Ninguna etapa ha pasado a PDN.                 |
| Sitio  | QA publicado en <https://qa.conducirjrdelsinu.pages.dev>; PDN aún no. |

## Etapas terminadas

| #   | Etapa                          | Qué quedó                                                                                                                                                | PR  |
| --- | ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- | --- |
| 1   | Entorno local (DEV)            | React 19 + Vite 8 + TypeScript estricto, ESLint, Stylelint y Prettier. Variables de entorno validadas para DEV, QA y PDN.                                | —   |
| 2   | Tokens, fuentes y estilos      | Style Dictionary genera `variables.css` desde `design-tokens/`. Barlow y Barlow Condensed autoalojadas. Stylelint solo acepta variables.                 | —   |
| 3   | Marca y componentes base       | Botones, links de acción, franja, encabezados, tarjetas, acordeón, velocímetro, aguada e íconos. Catálogo en `/dev/componentes`.                         | —   |
| —   | Configuración de GitHub y CI   | Rulesets de `qa` y `main`, Dependabot, plantilla de PR y CODEOWNERS. `ci.yml` con 10 verificaciones obligatorias.                                        | #1  |
| 4   | Dominio                        | Entidades con sus reglas (NIT, horas, horarios…), contratos de repositorio y 10 casos de uso. Sin React ni librerías externas.                           | #9  |
| 5   | Datos                          | Contenido real en JSON y Markdown, esquemas Zod estrictos, mappers, 9 repositorios y validación de coherencia entre archivos.                            | #10 |
| 6   | DI y providers                 | `di/container.ts` como composition root, `DependencyProvider` y `QueryProvider`. El README documenta cómo pasar a Supabase.                              | #12 |
| 7   | Hooks                          | Hooks de datos con TanStack Query y Suspense, claves de consulta centralizadas y enlaces de contacto (WhatsApp, llamada, mapas).                         | #13 |
| 8   | Features                       | Componentes de cada sección con datos reales, validados contra los mockups a 1440 y 390 px.                                                              | #14 |
| 9   | Páginas                        | Detalle más abajo.                                                                                                                                       | #15 |
| 10  | SEO, prerender y analítica     | Detalle más abajo.                                                                                                                                       | #16 |
| 11  | Pruebas                        | Detalle más abajo.                                                                                                                                       | #17 |
| 12  | Despliegue en Cloudflare Pages | Detalle más abajo.                                                                                                                                       | #18 |
| 13  | Documentación                  | Guía para actualizar el contenido, checklist de pruebas manuales de QA, regla de Dependabot para versiones mayores, guía de instalación y README al día. | —   |

Las etapas 1–3 entraron con el primer commit del repositorio, antes de adoptar el flujo de ramas `feature/*`.

### Detalle de la etapa 9 (páginas)

- **Las 8 páginas:** Inicio, Nosotros, Servicios, Planes, Contáctanos, Preguntas frecuentes, Política de datos y 404. Cada una se descarga por separado.
- **Layout:**
  - Menú fijo de 124 → 72 px y menú móvil.
  - Footer y botón flotante de WhatsApp.
  - Aviso de privacidad y etiqueta QA.
  - "Saltar al contenido".
  - Un Error Boundary por página.
- **Política de datos:** la página muestra el texto oficial aprobado con su índice.

### Detalle de la etapa 10 (SEO, prerender y analítica)

- **Prerender:** cada ruta y la 404 se generan como HTML estático con React 19 (`react-dom/static`). Llevan su CSS y la caché de consultas, y el navegador hidrata sin repetir consultas.
- **SEO:**
  - Título, descripción, canónica, Open Graph y JSON-LD (`DrivingSchool` y `FAQPage`).
  - `sitemap.xml` en PDN.
  - `noindex` en QA y en la 404.
- **Analítica:** Cloudflare Web Analytics solo en PDN y solo con token.
- **Servidor local:** las e2e usan uno con las reglas de Cloudflare Pages, incluida la CSP. Gracias a él se encontraron y corrigieron dos problemas que habrían llegado a producción:
  - Scripts en línea de React.
  - Una prueba de `eval` de Zod que Firefox bloqueaba.
- **Rendimiento (Lighthouse, móvil):** 98–100, con primera pintura de 1.0 a 1.8 s y 0 ms de bloqueo.

### Detalle de la etapa 11 (pruebas)

- **Page Objects** por página (`tests/e2e/pages/`), usados como fixtures: `home`, `plans`, `contact`, `faq` y `policy`.
- **Flujos e2e en Chromium, Firefox, WebKit y móvil:**
  - navegación con la página activa y el foco en el contenido;
  - "Saltar al contenido";
  - WhatsApp con el número y el mensaje de cada plan;
  - "Tu curso en horas" con mouse y teclado;
  - menú móvil (foco atrapado, Esc);
  - aviso de privacidad, que se recuerda y no lo tapa el botón;
  - Contáctanos: llamar, correo, redes, "Copiar" y el mapa que no carga Google antes de tocarlo;
  - anclas y preguntas frecuentes.
- **Regresión visual:** las 8 páginas a 1440 y 390 px. Las capturas de referencia se generan en Linux con el workflow "Actualizar capturas de referencia".
- **Smoke de PDN:** titular, WhatsApp, ubicación, indexación (robots y sitemap) y 404.
- **Cobertura mínima obligatoria:** dominio, datos, formateadores y SEO.
- **Estabilidad (18 oct 2026):**
  - La regresión de QA marcó una prueba inestable en WebKit: el teclado se usó antes de que React hidratara el HTML prerenderizado.
  - Ahora el sitio marca `<html data-hydrated>` al terminar de hidratar y los Page Objects esperan esa marca.
  - Verificado con 10 repeticiones en 4 navegadores, sin fallos.

### Detalle de la etapa 12 (despliegue en Cloudflare Pages)

- **`deploy-reusable.yml`:** hace la build del ambiente con prerender y la publica con Wrangler (versión fija). Usa los secrets del environment y, en PDN, su aprobación manual.
- **`deploy-qa.yml`:** al integrar en `qa`, despliega a <https://qa.conducirjrdelsinu.pages.dev> (Cloudflare Access) y corre la regresión en 4 navegadores con el Service Token.
  - **Plan de respaldo** (`QA_REMOTE_DEPLOY=false`): no publica y prueba la build en Actions.
- **`deploy-prod.yml`:** al integrar en `main`, espera tu aprobación, despliega a <https://conducirjrdelsinu.pages.dev> y corre el smoke. Si falla, el resumen indica cómo revertir.
- **Runners fijos en `ubuntu-24.04`:** así la migración de `ubuntu-latest` a Ubuntu 26 no invalida las capturas de referencia.
- **[`configuracion-cloudflare.md`](configuracion-cloudflare.md):** guía paso a paso del proyecto, el token, Access, el Service Token, Web Analytics, cómo revertir, un dominio propio y el mantenimiento.

### Ajustes después de la etapa 12

- **Estabilidad de las pruebas e2e** (PR #19): ver el detalle de la etapa 11.
- **Fondo de página (18 oct 2026):** pasa del Marfil `#FBF8F0` al Blanco Cálido `#FDFBF7`, más claro y menos crema, por decisión del dueño.
  - Es un solo token (`--color-neutral-canvas`), así que el cambio llega a todas las páginas, al menú, al menú móvil y al footer.
  - Las tarjetas siguen en blanco y se separan del fondo por su sombra teñida de verde.
  - Los contrastes de texto suben levemente; DESIGN.md (§2 y registro de cambios) quedó actualizado.
- **Regresión contra QA real (18 oct 2026):** con el despliegue remoto activo, WebKit anotó en la consola el estado 404 del documento de `/no-existe`, que es la respuesta correcta de la página 404.
  - El filtro del Page Object comparaba con `page.url()`, y en WebKit ese aviso puede llegar antes de que esa URL cambie.
  - Ahora solo la prueba de `/no-existe` ignora ese aviso y lo compara con la ruta navegada. Cualquier otro error, incluido un 404 de otro recurso, hace fallar la prueba.
- **Inicio (18 oct 2026), por decisión del dueño:** la sección de beneficios ya no lleva el eyebrow "Por qué J&R", y el titular pasa de "Aprende a conducir con confianza en Cereté" a "Aprende a conducir con confianza". Cereté sigue en el título de la pestaña, la descripción y los datos estructurados, así que el SEO local no cambia. Con el hero más bajo apareció un error que el titular largo ocultaba: desde 1100 px, la tarjeta del velocímetro invadía la sección siguiente. El alto mínimo de 600 px del hero nunca se aplicaba, porque una consulta de contenedor no puede dar estilos al propio contenedor; ahora va en su contenido. Se actualizaron las pruebas y las capturas de referencia de Inicio.
- **Crédito en el footer (18 oct 2026):** la franja inferior dice "© 2026 Conducir J&R del Sinú · NIT 901722359-5 Designed by Joker", con el mismo tamaño y gris del copyright y "Joker" en Verde Sinú semibold. En móvil el crédito pasa a una segunda línea porque no cabe. Como el footer está en todas las páginas, se actualizaron todas las capturas de referencia.
- **Vistas previas al compartir (18 oct 2026):** auditoría y ajuste de Open Graph para WhatsApp, Facebook, LinkedIn y X.
  - Cada página tiene título propio para compartir (sin repetir el nombre del sitio) y una descripción de máx. 80 caracteres, para que WhatsApp no la corte. Se agregaron `og:image:type` y la tarjeta completa de X.
  - La imagen `og-image.png` pasó a fondo blanco puro con el mismo logo (72 KB).
  - Pruebas: unitarias de la construcción de etiquetas, del tamaño y el peso de la imagen; e2e que lee el HTML de las 8 páginas y descarga la imagen; el smoke de PDN descarga la imagen con su URL absoluta.
  - Checklist de QA, sección 9: verificación con el Sharing Debugger de Facebook y en WhatsApp después de publicar.

## Etapas que faltan

| #   | Etapa      | Alcance                                                                                                                        |
| --- | ---------- | ------------------------------------------------------------------------------------------------------------------------------ |
| 14  | Paso a PDN | Revisar QA con el [checklist](checklist-pruebas-manuales-qa.md), PR `qa` → `main`, aprobación del despliegue y smoke en verde. |

## Pendientes

Los asuntos abiertos (fotos reales, aprobación de respuestas, token de analítica, Search Console…) se registran en [pendientes.md](pendientes.md).

## Verificaciones al cierre de la etapa 12

| Verificación                 | Resultado                                                                               |
| ---------------------------- | --------------------------------------------------------------------------------------- |
| Workflows (actionlint)       | Sin errores en `ci`, `update-snapshots`, `deploy-reusable`, `deploy-qa` y `deploy-prod` |
| Opciones de Wrangler 4.147.0 | Verificadas (`--project-name`, `--branch`, `--commit-hash`, `--production-branch`)      |
| Lint, tipos y pruebas        | Sin cambios de código en esta etapa; siguen en verde                                    |
| Despliegue real              | Pendiente de la configuración de Cloudflare (guía, pasos 1–8)                           |
