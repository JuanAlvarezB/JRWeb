# Conducir J&R del Sinú — Style Reference

> Pista al atardecer: lienzo marfil cálido, tarjetas blancas flotando, un solo verde Sinú para actuar y la franja roja del logo como firma.

**Tema:** claro (release 1 sin modo oscuro)
**Arquetipo:** sitio de servicio local orientado a contacto (conversión por WhatsApp y llamada), informativo, sin precios.
**Fuente de verdad:** este archivo. Los colores salen del logotipo; la estructura, superficies y ritmo salen de la referencia Harvest (Refero Styles). Ningún color, fuente, radio o sombra se usa fuera del rol definido aquí.
**Implementación:** `design-tokens/tokens.json` (sistema) y `design-tokens/components.json` (medidas de componentes del handoff) → Style Dictionary → `src/styles/variables.css`. Ningún componente escribe colores, tamaños, sombras ni fuentes literales.
**Cambios:** todo cambio de diseño empieza aquí; ver §12 Registro de cambios.

---

## 1. Reference lock

| Elemento                     | Decisión                                                                                                                                                                                                                                                                                                                                                                                                             |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Referencia dominante         | **Harvest** (Refero Styles, elegida por el dueño): lienzo cálido en lugar de blanco, tarjetas blancas flotantes con sombra teñida de la marca, un único color de acción, radios suaves 16/20 px, encabezado de sección eyebrow + título, hero centrado con tarjetas flotantes sobre una aguada de color.                                                                                                             |
| Se conserva de Harvest       | 1) El lienzo cálido nunca es blanco puro. 2) Un solo color cromático de acción. 3) Profundidad por sombra teñida, no por bordes. 4) Radios: botones e inputs 16 px, tarjetas 20 px, etiquetas en píldora. 5) Densidad cómoda: 64–80 px entre secciones, sin bandas oscuras. 6) "La interfaz es el hero": tarjetas de información reales flotando en el hero en lugar de fotos.                                       |
| Se reemplaza por la marca    | Naranja `#fa5d00` → **verde Sinú** `#005932` (mismo rol: acción, links, estados activos). Aguada naranja/durazno → **aguada verde** con el degradado del auto del logo. Serif Monarch → **Barlow Condensed ExtraBold Italic**, que replica la letra del logotipo, con el mismo rol (solo titulares de máxima jerarquía). MuotoWeb → **Barlow** (sustituto libre, misma familia que el display).                      |
| Se toma prestado (solo esto) | 1) **La franja roja inclinada del logo** como etiqueta firma. 2) **El arco del velocímetro** como motivo gráfico y de progreso. Ambos salen del logotipo, no de otra marca.                                                                                                                                                                                                                                          |
| Se rechaza                   | Fondo blanco puro de página; un segundo color de acción; el rojo como relleno de botones; fotos de stock; capturas o datos inventados; fuentes serif; bandas oscuras a todo el ancho; sombras grises frías; esquinas rectas en tarjetas y botones; texto en mayúsculas en párrafos; modo oscuro en el release 1; el verde de WhatsApp `#25D366` (el botón de WhatsApp usa el verde Sinú y se reconoce por su ícono). |

---

## 2. Colores (medidos del logotipo)

### Marca

| Nombre           | Valor     | Token                    | Rol (no se usa para nada más)                                                                                                                                                  |
| ---------------- | --------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Verde Sinú       | `#005932` | `--color-brand-default`  | Único color de acción: relleno del botón principal, links, estado activo del menú, eyebrows, íconos de check, foco. Los títulos de sección van siempre en Tinta.               |
| Verde Profundo   | `#00502C` | `--color-brand-hover`    | Hover/pressed del botón principal y de links. Sale de la paleta del logo (ajuste aprobado; antes `#00472A`).                                                                   |
| Verde Pista      | `#00AA4C` | `--color-brand-bright`   | Solo decorativo: final del degradado del auto, aguada del hero y tramo Manejo del arco de horas. **Nunca texto** (2.9:1).                                                      |
| Lima Velocímetro | `#9BC844` | `--color-brand-lime`     | Solo decorativo: segmentos internos del arco del velocímetro, tramo Taller del arco de horas, aguada y comillas de los testimonios. **Nunca texto ni fondo de texto pequeño.** |
| Brillo Lima      | `#E8F3D6` | `--color-brand-glow`     | Atmosférico: lavado suave detrás de tarjetas del hero y círculos de íconos. Nunca fondo de sección completa.                                                                   |
| Rojo Franja      | `#F10825` | `--color-ribbon-default` | Solo la franja inclinada firma, con texto blanco **bold de 19 px o más** (4.37:1, válido solo como texto grande).                                                              |
| Rojo Aguja       | `#C71424` | `--color-ribbon-small`   | Variante de la franja para etiquetas pequeñas (texto blanco < 19 px, 5.91:1) y la aguja del velocímetro.                                                                       |

### Neutros

| Nombre        | Valor     | Token                           | Rol                                                                                      |
| ------------- | --------- | ------------------------------- | ---------------------------------------------------------------------------------------- |
| Blanco Cálido | `#FDFBF7` | `--color-neutral-canvas`        | Fondo de todas las páginas, nav y footer. La calidez es parte de la identidad.           |
| Papel         | `#FFFFFF` | `--color-neutral-surface`       | Tarjetas, paneles elevados, aviso de privacidad.                                         |
| Tinta         | `#1D1E1C` | `--color-neutral-text`          | Texto principal, íconos, títulos de tarjeta. Nunca `#000000`.                            |
| Piedra        | `#615F5C` | `--color-neutral-text-muted`    | Texto secundario y descripciones (6.2:1).                                                |
| Madera        | `#8E8B87` | `--color-neutral-text-disabled` | Solo trazos decorativos y estados deshabilitados. **No para texto informativo** (3.3:1). |
| Hueso         | `#C0BBB6` | `--color-neutral-border-strong` | Bordes de controles en reposo.                                                           |
| Niebla        | `#E4DFD3` | `--color-neutral-border`        | Divisores y líneas finas.                                                                |
| Error         | `#B42318` | `--color-feedback-error`        | Mensajes de error, siempre con ícono y texto. Distinto del rojo de marca.                |

### Proporción de uso

Lienzo y tarjetas ~60 % · tinta y neutros ~28 % · verde Sinú ~10 % · rojo < 2 % (máximo **una franja roja visible por pantalla**; la franja dentro del logo no cuenta).

**Excepción documentada — arco de horas:** en "Tu curso en horas" los tramos usan Teoría Verde Sinú `#005932`, Taller Lima `#9BC844` y Manejo Verde Pista `#00AA4C` (tokens `--color-course-*`), siempre con leyenda en texto con las horas; el color nunca es la única señal.

### Contraste verificado (WCAG 2.1)

| Combinación                            | Ratio       | Uso permitido            |
| -------------------------------------- | ----------- | ------------------------ |
| Tinta sobre Blanco Cálido              | 16.2:1      | Todo texto               |
| Piedra sobre Blanco Cálido             | 6.2:1       | Texto secundario         |
| Verde Sinú sobre Blanco Cálido         | 8.2:1       | Links, títulos, eyebrows |
| Blanco sobre Verde Sinú                | 8.5:1       | Botón principal          |
| Blanco sobre Rojo Franja               | 4.37:1      | Solo texto bold ≥ 19 px  |
| Blanco sobre Rojo Aguja                | 5.9:1       | Etiquetas pequeñas       |
| Error sobre Blanco Cálido              | 6.4:1       | Mensajes de error        |
| Verde Pista / Lima sobre Blanco Cálido | 3.0 / 1.9:1 | Prohibido como texto     |

---

## 3. Tipografía (Google Fonts, licencia libre, autoalojadas)

| Rol                | Familia              | Peso            | Tamaños                        | Reglas                                                                                                                                                                                           |
| ------------------ | -------------------- | --------------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Display            | **Barlow Condensed** | 800 _italic_    | 72 px escritorio · 40 px móvil | MAYÚSCULAS, interlineado 0.98, tracking 0, `text-wrap: balance`. Solo el H1 de cada página. Replica la letra del logo. Nunca en párrafos, botones ni menú. Un solo titular display por pantalla. |
| Títulos de sección | Barlow               | 600             | 40 px · 28 px móvil            | Tipo oración (no mayúsculas), color Tinta, tracking −0.01em, `text-wrap: balance`.                                                                                                               |
| UI y texto         | Barlow               | 400 / 500 / 600 | 13–20 px                       | Tracking +0.015em (regla Harvest). Cuerpo mínimo 16 px. Botones 600.                                                                                                                             |
| Eyebrow            | Barlow               | 700             | 14 px                          | MAYÚSCULAS, tracking +0.06em, color Verde Sinú.                                                                                                                                                  |

**Escala:** caption 13 · body 16 · body-lg 18 · heading-sm 20 · heading 24 · heading-lg 32 · section 40 · display 56 · display-lg 72.
**Pesos cargados:** Barlow 400/500/600/700 y Barlow Condensed 800 itálica, autoalojadas (Fontsource, OFL, subconjunto latino, `font-display: swap`); solo se precarga la del titular. **No** se usa Barlow Semi Condensed ni Barlow Condensed 900.
**Prohibido:** cambiar una palabra del titular a otra fuente, cursiva o color como adorno.

---

## 4. Espaciado y forma

- **Base:** 4 px. Escala: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 112.
- **Contenedor:** máx. 1200 px, margen lateral 16 px en móvil, 32 px en escritorio.
- **Cambio de disposición:** un solo punto de quiebre a **720 px** (móvil < 720 ≤ escritorio). Diseñado a 390 y 1440; se verifica en 360, 390, 768, 1024 y 1440.
- **Entre secciones:** 64–80 px escritorio, 48 px móvil.
- **Relleno de tarjetas:** 32–40 px escritorio, 24 px móvil. Separación entre elementos 16–24 px.
- **Radios:** botones 16 · inputs 16 · imágenes y mapa 16 · tarjetas 20 · etiquetas 999. **Excepción documentada:** la franja roja es un paralelogramo sin radio con cortes a 30°, como en el logo (dibujado con `clip-path`; el texto no se inclina).
- **Áreas táctiles:** mínimo 44 × 44 px.

### Sombras (teñidas de la marca, nunca grises frías)

| Token               | Valor                                | Uso                                                   |
| ------------------- | ------------------------------------ | ----------------------------------------------------- |
| `--shadow-sm`       | `0 1px 4px rgba(29, 30, 28, 0.16)`   | Botón principal                                       |
| `--shadow-lg`       | `6px 4px 24px rgba(0, 89, 50, 0.14)` | Todas las tarjetas, aviso y botón flotante            |
| `--shadow-lg-hover` | `8px 8px 32px rgba(0, 89, 50, 0.18)` | Hover de tarjetas (sombra un poco mayor, sin escalar) |

### Aguada del hero

Forma orgánica fluida (no franja de degradado) con `#005932 → #00AA4C → #9BC844` al 18–30 % de opacidad, detrás de las tarjetas flotantes. Evoca el degradado del auto del logo. **Nunca detrás de texto.**

---

## 5. Componentes

**Navegación.** Sticky, fondo Blanco Cálido con línea Niebla al hacer scroll. Escritorio: 124 px de alto con el logo completo (240 px); con scroll > 80 px pasa a 72 px con el logo-ícono (96 px). Móvil: 64 px con el logo-ícono (84 px). Logo horizontal a la izquierda; enlaces al centro (Barlow 500, 16 px, Tinta; activo en Verde Sinú con subrayado de 2 px); a la derecha "Llamar" como link y **"Escríbenos"** como botón principal. En móvil: logo-ícono, botón "Escríbenos" y menú hamburguesa a pantalla completa sobre Blanco Cálido.

**Botón principal.** Verde Sinú, texto blanco Barlow 600 16 px, 48 px de alto (52 px a todo el ancho en móvil), relleno horizontal 24 px, radio 16, `--shadow-sm`, hover Verde Profundo `#00502C`. Es el único botón con relleno de color. Ícono de WhatsApp a la izquierda cuando abre WhatsApp.

**Botón contorno.** Borde 1.5 px Verde Sinú, texto Verde Sinú, radio 16. Para acciones secundarias como "Cómo llegar".

**Link de acción.** Verde Sinú, Barlow 600, flecha → y subrayado en hover.

**Franja firma (componente distintivo).** Paralelogramo con cortes a 30° en Rojo Franja (48 px de alto) con texto blanco Barlow 700 22 px MAYÚSCULAS; en móvil, variante pequeña en Rojo Aguja (30 px de alto, 14 px, una línea). Uso permitido y único: la frase "Centro de Enseñanza Automovilística" junto al H1 del hero de Inicio. Máximo una por pantalla (la del logo no cuenta). No hay plan recomendado, así que ninguna tarjeta de plan lleva franja.

**Encabezado de sección.** Eyebrow + título Barlow 600 en Tinta + subtítulo opcional en Piedra 18 px (17 px en móvil). Centrado, ancho máx. 700 px.

**Tarjeta de beneficio.** Fondo blanco como todas las tarjetas, radio 20, relleno 40 × 32 (24 en móvil). Ícono de línea Tinta 36 px dentro de un círculo Brillo Lima de 64 px, título 22 px 600, texto Piedra 16 px, link de acción opcional.

**Tarjeta flotante del hero.** Blanca, radio 20, `--shadow-lg`, rotación −2° / +2°, desplazadas a izquierda y derecha del titular. Contenido real, nunca datos inventados: "Licencia B1 · Servicio particular" con su total de horas, "Clases teóricas" con las jornadas diurna y nocturna, "Ubicación · Cereté" con mini mapa estático y "B1 · 50 horas" con el arco del velocímetro dividido en teoría, taller y manejo. En móvil se apilan bajo el titular (máximo 2).

**Arco del velocímetro.** SVG con segmentos externos Verde Sinú, internos Lima y aguja Rojo Aguja. Usos: sección "Tu curso en horas" y su tarjeta del hero (tramos proporcionales a las horas reales de teoría, taller y manejo, con los colores de la excepción documentada en §2), decoración del hero y página 404 (arco completo Verde Sinú, aguja en cero).

**Tarjeta de plan.** Blanca, radio 20, relleno 32 (24 en móvil), `--shadow-lg`. Eyebrow con edad y servicio, nombre (26 px 600), descripción (Piedra), lista "Incluye" con checks Verde Sinú, botón principal "Consultar precio" (abre WhatsApp con el plan). **Sin precio.** Las tres tarjetas tienen el mismo peso visual (no hay plan recomendado).

**Tarjeta de canal de contacto.** Blanca, radio 20, relleno 24. Círculo blanco de 48 px con ícono Tinta sobre fondo Brillo Lima, etiqueta (Piedra 14), dato (Tinta 18 600) y acción (link de acción; en escritorio, botón "Copiar" tipo link).

**Bloque de ubicación.** Dos columnas: fachada del mapa (imagen estática radio 16, pin, botón "Ver mapa") y tarjeta blanca con dirección clicable, horarios de clases, botón principal "Cómo llegar" y link "Abrir en Waze". En móvil, el mapa va primero.

**Preguntas frecuentes.** Acordeón de tarjetas blancas radio 16, separación 12 px, `--shadow-lg`, chevron Verde Sinú, pregunta Barlow 600 18 px (17 en móvil), varios abiertos a la vez.

**Tarjeta de testimonio** _(añadida en el handoff)_. Mismas reglas de tarjeta: comillas Lima decorativas, cita en Tinta 17–20 px, autor y fuente en Piedra 14 px. Solo opiniones reales, con su fecha o la fecha de consulta.

**Tarjeta de calificación** _(añadida en el handoff)_. "5.0" 56 px 700, cinco estrellas en Tinta (el verde queda para acciones), número de opiniones con fecha del dato y link "Ver opiniones en Google".

**Botón flotante de WhatsApp.** Círculo 56 px Verde Sinú, ícono WhatsApp blanco, `--shadow-lg`, abajo a la derecha, 16 px del borde (24 px en escritorio). No tapa el aviso de privacidad.

**Aviso de privacidad.** Tarjeta blanca radio 16, `--shadow-lg`, máx. 360 px, abajo a la izquierda (ancho completo menos 32 px en móvil), texto Piedra 14 px, link a la política y link de acción "Entendido".

**Footer.** Fondo Blanco Cálido con divisor Niebla superior (sin banda oscura). Logo, columnas (Páginas, Contacto, Horarios, Redes), NIT y enlace a la Política de Tratamiento de Datos en Piedra 14 px.

**Etiqueta de ambiente (solo QA).** Píldora Tinta con texto blanco "QA", fija arriba a la izquierda.

---

## 6. Iconografía e imágenes

- **Íconos:** Lucide (licencia ISC), trazo 1.75 px (2 px en flechas y chevrons), color Tinta; Verde Sinú solo en checks y estados activos. Sin íconos multicolor ni emojis.
- **Íconos de marca** (WhatsApp, Facebook, Instagram, TikTok): también de línea, como en los mockups. Lucide 1.x no los incluye: WhatsApp sale de Tabler Icons (MIT), Facebook e Instagram de versiones previas de Lucide (ISC) y TikTok es un trazo propio.
- **Flecha del link de acción:** ícono `arrow-right`, porque Barlow no trae el carácter "→" en el subconjunto latino.
- **Imágenes:** no hay fotos reales en el release 1 y no se usan fotos de stock. El rol visual de "producto" lo cumplen las tarjetas flotantes con información real, el arco del velocímetro y el mapa. Se dejan previstos espacios 4:3 con radio 16 para fotos futuras de sede y flota. **Decisión del 15 oct 2026:** mientras no haya fotos reales, el espacio **no se muestra** y el bloque pasa a una columna; al agregar la foto en el contenido aparece en 2 columnas sin cambiar código. Los mockups muestran el marcador solo como referencia de dirección de arte.

---

## 7. Movimiento

- Entrada de tarjetas: aparecen con desplazamiento de 12 px y opacidad, 300 ms, `ease-out`, escalonadas 60 ms.
- **Detalle memorable:** en la primera carga, la aguja del velocímetro del hero barre de 0 a su posición en 900 ms `cubic-bezier(.2,.8,.2,1)`.
- Hover de tarjetas: sombra un poco mayor, sin escalar.
- Sin parallax ni animaciones en bucle. Todo se desactiva con `prefers-reduced-motion`.

---

## 8. Arquetipo y estructura de páginas

**Modelo:** contenedor centrado de 1200 px sobre Blanco Cálido a todo el ancho. Secciones separadas por espacio, no por bandas de color. Grillas: 3 columnas para beneficios, 2 columnas para texto + visual, 1 columna centrada para llamados a la acción.

**Inicio** (el orden responde a las dudas reales del cliente: ¿son confiables?, ¿qué tengo que hacer?, ¿qué incluye?, ¿dónde quedan?):

1. **Hero:** franja firma, H1 display (máx. 3 líneas), subtítulo, botones "Escríbenos por WhatsApp" + link "Ver planes", tarjetas flotantes sobre la aguada verde y el arco del velocímetro.
2. **Por qué estudiar con nosotros:** 3 tarjetas de beneficio (diferenciadores), con título y sin eyebrow.
3. **Tu curso en horas:** selector A2 / B1 / C1 y el arco del velocímetro con la distribución real de horas (teoría, taller, manejo) y el total. Debajo, el link "Consulta los requisitos por WhatsApp".
4. **Planes destacados:** 2–3 tarjetas de plan, sin precio.
5. **Servicios:** bloques de 2 columnas texto + visual.
6. **Testimonios:** solo si existen, nunca inventados.
7. **Contáctanos resumido + ubicación**, luego el footer.

**Nosotros:** hero de página (título display), misión y visión en 2 tarjetas, diferenciadores (instructores certificados, horarios flexibles) y NIT. Sin valores ni historia: la página es netamente informativa.
**Servicios:** encabezado + lista de servicios en bloques de 2 columnas (descripción, requisitos, duración).
**Planes:** encabezado con la nota "Escríbenos y te enviamos el precio y las promociones vigentes", grilla de tarjetas de plan, preguntas frecuentes sobre planes.
**Contáctanos:** botón principal de WhatsApp grande, directorio de canales en grilla, bloque de ubicación, horarios de clases.
**Preguntas frecuentes:** acordeón agrupado por tema.
**Política de datos:** columna de lectura de 720 px con índice lateral (arriba en móvil).
**404:** arco del velocímetro con la aguja en cero, título "Te saliste de la vía" y botón "Volver al inicio".

---

## 9. Voz y textos

- Lenguaje cercano y de confianza, claro y directo; tuteo. Frases cortas, sin tecnicismos.
- Los botones dicen la acción concreta: "Escríbenos por WhatsApp", "Consultar precio", "Cómo llegar".
- No se prometen resultados que dependan de la autoridad de tránsito; no se inventan cifras, testimonios ni sellos.

---

## 10. Do's and Don'ts

### Do

- Usar Verde Sinú `#005932` exclusivamente para acciones, links, estados activos y eyebrows.
- Mantener todas las páginas sobre Blanco Cálido `#FDFBF7` y las tarjetas en blanco.
- Reservar Barlow Condensed ExtraBold Italic para un titular de máxima jerarquía por pantalla.
- Aplicar radio 16 a botones e inputs y 20 a tarjetas.
- Usar sombras teñidas de verde para la profundidad.
- Mostrar la franja roja como máximo una vez por pantalla.

### Don't

- No usar blanco puro como fondo de página.
- No rellenar botones con rojo ni introducir otro color de acción (tampoco el verde de WhatsApp).
- No usar Verde Pista ni Lima como texto.
- No poner texto blanco menor a 19 px sobre Rojo Franja.
- No usar fuentes serif ni cambiar palabras del titular a otro estilo como adorno.
- No usar bandas oscuras a todo el ancho, fotos de stock ni capturas inventadas.
- No usar `#000000` para texto.

---

## 11. Variables CSS (generadas)

No se escriben a mano. `npm run tokens` genera `src/styles/variables.css` desde `design-tokens/`. Nombres principales:

| Grupo            | Variables                                                                                                                                                                                                                       |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Marca            | `--color-brand-default`, `--color-brand-hover`, `--color-brand-bright`, `--color-brand-lime`, `--color-brand-glow`, `--color-ribbon-default`, `--color-ribbon-small`                                                            |
| Neutros          | `--color-neutral-canvas`, `--color-neutral-surface`, `--color-neutral-text`, `--color-neutral-text-muted`, `--color-neutral-text-disabled`, `--color-neutral-border-strong`, `--color-neutral-border`, `--color-feedback-error` |
| Arco de horas    | `--color-course-theory`, `--color-course-workshop`, `--color-course-driving`                                                                                                                                                    |
| Tipografía       | `--font-family-display`, `--font-family-body`, `--font-weight-*`, `--font-size-*`, `--font-line-height-*`, `--font-letter-spacing-*`                                                                                            |
| Espacio y layout | `--space-1` … `--space-28`, `--layout-*`                                                                                                                                                                                        |
| Forma            | `--radius-*`, `--shadow-sm`, `--shadow-lg`, `--shadow-lg-hover`, `--focus-*`                                                                                                                                                    |
| Movimiento       | `--motion-duration-*`, `--motion-easing-out`, `--motion-distance-enter`                                                                                                                                                         |
| Componentes      | `--component-*` (medidas del handoff: menú, botones, franja, tarjetas, acordeón, aviso, capas)                                                                                                                                  |

---

## 12. Registro de cambios

| Fecha       | Cambio                                                                                                                                                                                                                                                                   | Origen                                             |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------- |
| 14 oct 2026 | Hover de acción `#00472A` → `#00502C` (Verde Profundo del logo).                                                                                                                                                                                                         | Ajustes aprobados del handoff                      |
| 14 oct 2026 | Franja a 30° con `clip-path` (antes −12°); variante pequeña Rojo Aguja 14 px en móvil; la franja del logo no cuenta en el límite.                                                                                                                                        | Ajustes aprobados del handoff                      |
| 14 oct 2026 | Tarjetas de beneficio en blanco; títulos de sección siempre en Tinta.                                                                                                                                                                                                    | Ajustes aprobados del handoff                      |
| 14 oct 2026 | Colores del arco por horas: Teoría / Taller / Manejo (excepción documentada).                                                                                                                                                                                            | Ajustes aprobados del handoff                      |
| 14 oct 2026 | Menú de escritorio 124 → 72 px con scroll; tarjetas de testimonio y calificación; sin Barlow Semi Condensed.                                                                                                                                                             | Ajustes aprobados del handoff                      |
| 15 oct 2026 | Espacios de foto 4:3 ocultos mientras no haya fotos reales.                                                                                                                                                                                                              | Decisión del dueño (desarrollo)                    |
| 15 oct 2026 | Nombres de variables alineados con las generadas por Style Dictionary; medidas de componentes del handoff en `design-tokens/components.json`.                                                                                                                            | Implementación (sin cambio visual)                 |
| 16 oct 2026 | Número del centro del velocímetro sin leyenda (404 y tarjeta del hero): 64 px, medido en los mockups (con leyenda sigue en 56 px).                                                                                                                                       | Validación visual contra mockups                   |
| 16 oct 2026 | Íconos de marca en estilo de línea y flecha del link de acción como ícono (ver §6).                                                                                                                                                                                      | Validación visual contra mockups                   |
| 16 oct 2026 | El componente `SpeedometerArc` dibuja el arco del handoff (tramos proporcionales); `speedometer-arc.svg` (velocímetro del logo, segmentos fijos) queda como activo de marca en `public/assets/brand/`.                                                                   | Implementación                                     |
| 16 oct 2026 | Hero entre 720 px y un contenedor de 1100 px: las 4 tarjetas en grilla 2 × 2 bajo el titular (no caben a los lados sin tapar el texto). Desde 1100 px, flotantes como en el mockup.                                                                                      | Implementación (sin cambio visual a 1440 px)       |
| 16 oct 2026 | El mapa del bloque de ubicación es una fachada (plano ilustrado + "Ver mapa"): Google Maps se carga solo al tocarlo. Sin fotos, los bloques de Servicios van en una columna de lectura centrada.                                                                         | Implementación (rendimiento y privacidad)          |
| 17 oct 2026 | Menú según su ancho: ≥ 1240 px como el mockup; 1140–1239 px sin "Llamar" (está en el footer y en Contáctanos); 1000–1139 px además con el logo-ícono; < 1000 px con ☰. La barra es fija y el `<header>` conserva su alto: al pasar a 72 px el contenido no se desplaza. | Implementación (sin cambio visual a 1440 / 390 px) |
| 18 oct 2026 | Fondo de página Marfil `#FBF8F0` → Blanco Cálido `#FDFBF7`: más claro y menos crema, sigue sin ser blanco puro. Las tarjetas blancas se separan por la sombra teñida; los contrastes suben levemente (§2).                                                               | Decisión del dueño                                 |
| 18 oct 2026 | Inicio: titular "Aprende a conducir con confianza" (sin "en Cereté"; Cereté sigue en el título de la pestaña y la descripción) y la sección de beneficios sin el eyebrow "Por qué J&R". El hero mide al menos 600 px desde 1100 px para contener las tarjetas flotantes. | Decisión del dueño                                 |
| 17 oct 2026 | Política de datos: el mockup era un marcador; la página muestra el texto oficial aprobado con índice. Los títulos de sección (en mayúsculas en el documento) se muestran en tipo oración, sin cambiar el texto guardado.                                                 | Contenido aprobado                                 |
