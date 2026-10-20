# Checklist de pruebas manuales en QA

Revisión a mano de <https://qa.conducirjrdelsinu.pages.dev> antes de abrir el PR `qa` → `main`. Las pruebas automáticas ya revisan los flujos en 4 navegadores; esta lista cubre lo que solo una persona puede juzgar: que el contenido sea correcto, que se vea bien y que los enlaces abran las apps reales en un celular.

## Cómo usarla

1. Entra a QA con tu correo autorizado: Cloudflare Access envía un código.
2. Revisa en **un computador** (Chrome o Safari) y en **un celular real** (Android o iPhone). Las secciones marcadas con 📱 se hacen en el celular.
3. Copia esta lista en un comentario del PR `qa` → `main` y marca cada punto. Si algo falla, no integres: corrígelo con un PR hacia `qa` y repite solo lo afectado.

**Revisión completa** antes del primer paso a PDN y cuando cambie el diseño. **Revisión corta** (secciones 1, 2 y lo relacionado con el cambio) para cambios de contenido.

## 1. Antes de empezar

- [ ] La regresión de la última ejecución de **Despliegue a QA** pasó en GitHub Actions.
- [ ] QA muestra la etiqueta **"QA"** arriba a la izquierda.
- [ ] El cambio que se va a publicar se ve en QA (si no, espera a que termine el despliegue y recarga).

## 2. El cambio de este PR

- [ ] Lo que cambió se ve como se esperaba, en computador y en celular.
- [ ] El texto no tiene errores de ortografía, tildes ni datos desactualizados.

## 3. Contenido

- [ ] **Inicio:** titular, horas de los planes, horarios, dirección y calificación de Google coinciden con la realidad.
- [ ] **Nosotros:** misión y visión son las aprobadas; NIT y razón social correctos.
- [ ] **Servicios:** las tres licencias (A2, B1 y C1) con sus vehículos y la edad mínima.
- [ ] **Planes:** horas de teoría, taller y manejo de cada licencia; **ningún precio** en la página.
- [ ] **Contáctanos:** teléfonos, correo, redes, dirección y horarios correctos.
- [ ] **Preguntas frecuentes:** las respuestas son las aprobadas por el dueño y siguen vigentes.
- [ ] **Política de datos:** la versión aprobada, con su índice y la sección de analítica al final.
- [ ] **Footer:** NIT, horarios, redes y el enlace a la Política de datos.

## 4. Enlaces y contacto

- [ ] El botón flotante y "Escríbenos" abren WhatsApp con el número principal y el mensaje "Hola, vi la página web…".
- [ ] En Planes, "Consultar precio" y "Consultar requisitos" abren WhatsApp con la licencia correcta en el mensaje (A2, B1 o C1).
- [ ] Facebook, Instagram y TikTok abren el perfil de la escuela en una pestaña nueva.
- [ ] El correo abre el programa de correo con la dirección de la escuela.
- [ ] En Contáctanos, "Copiar" copia el dato (pégalo en otro lado para comprobarlo).
- [ ] "Ver mapa" carga el mapa de Google con la sede marcada.
- [ ] "Cómo llegar" abre Google Maps con la ruta hasta la sede.
- [ ] "Ver opiniones en Google" abre el perfil de la escuela.
- [ ] Una dirección que no existe (por ejemplo `/prueba`) muestra la página "Te saliste de la vía" con sus botones.

## 5. 📱 En el celular

- [ ] El menú ☰ abre, lleva a cada página y se cierra con la ✕.
- [ ] El botón flotante de WhatsApp abre **la app** de WhatsApp, no la página web.
- [ ] Tocar un teléfono abre la llamada con el número.
- [ ] "Cómo llegar" abre la app de Google Maps y "Abrir en Waze" abre Waze, con la sede como destino.
- [ ] El aviso de privacidad aparece la primera vez, "Entendido" lo cierra y no vuelve al recargar.
- [ ] El botón flotante no tapa el aviso ni los botones de la página.
- [ ] Nada se sale de la pantalla ni obliga a desplazarse de lado.
- [ ] Los textos se leen sin hacer zoom.
- [ ] Girar el celular (horizontal) no rompe ninguna página.

## 6. Diseño (revisión completa)

Compara con los mockups de [`docs/mockups/`](mockups/) y con [DESIGN.md](../DESIGN.md).

- [ ] Fondo blanco cálido y tarjetas blancas con sombra verde suave en todas las páginas.
- [ ] Solo una franja roja por pantalla: "Centro de Enseñanza Automovilística" en Inicio.
- [ ] El menú se reduce al bajar en la página (computador) y marca la página actual.
- [ ] "Tu curso en horas" cambia el velocímetro al elegir A2, B1 o C1.
- [ ] Las tarjetas aparecen suavemente al bajar, sin saltos ni parpadeos.
- [ ] En un computador con pantalla mediana (unos 1100–1300 px de ancho), el menú y las tarjetas del hero no se montan sobre los textos.

## 7. Accesibilidad básica (revisión completa)

- [ ] Con la tecla **Tab** se recorre la página en orden y siempre se ve dónde está el foco.
- [ ] El primer **Tab** muestra "Saltar al contenido" y **Enter** lleva al contenido.
- [ ] Las preguntas frecuentes abren y cierran con **Enter** o **Espacio**.
- [ ] Con el zoom del navegador al 200 %, todo se lee y nada se superpone.

## 8. Antes de integrar en `main`

- [ ] Todo lo anterior está marcado o tiene su corrección integrada en `qa`.
- [ ] Los pendientes que bloquean la publicación están resueltos ([pendientes.md](pendientes.md)).
- [ ] El PR `qa` → `main` tiene esta lista marcada en un comentario.

Después de integrar, aprueba el despliegue en **Actions** y espera que el smoke de PDN pase. Luego abre <https://conducirjrdelsinu.pages.dev> y comprueba que el sitio público **no** tiene la etiqueta "QA".

## 9. Vistas previas al compartir (después de publicar en PDN)

Se revisan **en PDN**: QA está protegido con Cloudflare Access y marcado `noindex`, así que WhatsApp, Facebook y los demás no pueden leerlo (es lo esperado). Hazlo en la revisión completa y cada vez que cambien los títulos, las descripciones o la imagen para compartir.

> **WhatsApp guarda la vista previa de cada enlace en caché varios días** y no hay forma de borrarla. Verifícala **antes** de compartir el enlace de forma masiva: si sale mal la primera vez, quienes lo reciban seguirán viendo la versión vieja aunque se corrija.

**Facebook Sharing Debugger** (WhatsApp lee las mismas etiquetas, aunque guarda su propia caché):

1. Abre <https://developers.facebook.com/tools/debug/> e inicia sesión con una cuenta de Facebook.
2. Pega la URL de la página (empieza por Inicio: `https://conducirjrdelsinu.pages.dev/`) y pulsa **Debug**.
3. Si la página ya se había compartido antes del cambio, pulsa **Scrape Again** para que Facebook la vuelva a leer.

- [ ] **Response Code** es 200.
- [ ] La vista previa muestra la imagen con el logo sobre fondo blanco, el título de la página (sin "Conducir J&R del Sinú" repetido) y su descripción completa.
- [ ] No aparecen advertencias de propiedades faltantes (`og:image`, `og:title`, `og:description`, `og:url`).
- [ ] Repite con Planes, Contáctanos y Preguntas frecuentes (las que más se comparten).

**Prueba real en WhatsApp:**

- [ ] Envía a un chat de prueba (por ejemplo, el tuyo) el enlace de Inicio y el de Planes. Cada uno muestra la imagen, el título y la descripción sin cortes.
- [ ] Toca la vista previa: abre la página correcta en PDN.

Si la vista previa sale mal: corrige con el flujo normal (PR a `qa` → `main`), vuelve a pulsar **Scrape Again** en el Sharing Debugger y prueba en WhatsApp con un enlace que nunca se haya enviado (por ejemplo, agregando `?v=2` al final) para no ver la versión en caché.
