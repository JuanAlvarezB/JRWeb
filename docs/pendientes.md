# Pendientes

Asuntos que surgen durante el desarrollo y quedan para después. Cada uno indica quién lo resuelve y qué hacer cuando llegue el momento. Al resolver uno, se mueve a "Resueltos" con la fecha.

Las etapas del proyecto están en [estado-del-proyecto.md](estado-del-proyecto.md).

## Abiertos

| #   | Pendiente                                                 | Responsable    | Desde       | Qué hacer                                                                                                                                                                                                                              |
| --- | --------------------------------------------------------- | -------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Fotos reales de la sede y los vehículos                   | Dueño          | 17 oct 2026 | Descartado para el release 1. Cuando existan, se agregan a cada servicio en `src/data/content/services.json` (campo `photo` con `src` y `alt`) y el bloque pasa solo a dos columnas. Sin fotos de stock (DESIGN.md §6).                |
| 2   | Aprobar las respuestas propuestas de Preguntas frecuentes | Dueño          | 16 oct 2026 | Revisar las respuestas de "horas", "horario-teoricas", "dias-practicas", "requisitos" y "ubicacion" en `src/data/content/faq.json`. Se redactaron solo con datos reales del contenido.                                                 |
| 3   | Revisar el sitio en un celular real                       | Dueño y equipo | 17 oct 2026 | Cuando QA esté desplegado (etapa 12): probar WhatsApp, llamada, mapa ("Ver mapa"), "Cómo llegar" y "Abrir en Waze".                                                                                                                    |
| 8   | Configurar Cloudflare y GitHub para publicar               | Dueño          | 17 oct 2026 | Seguir [configuracion-cloudflare.md](configuracion-cloudflare.md), pasos 1–8: proyecto de Pages, token, secrets, Access con los correos autorizados, Service Token, primer despliegue a QA y Web Analytics. |
| 9   | Renovar el Service Token de Access                         | Dueño          | 17 oct 2026 | Antes de su vencimiento (1 año desde que se cree): crear uno nuevo y actualizar los secrets de `qa` ([configuracion-cloudflare.md](configuracion-cloudflare.md), "Mantenimiento").                           |
| 5   | Token de Cloudflare Web Analytics                         | Dueño          | 17 oct 2026 | Paso 8 de [configuracion-cloudflare.md](configuracion-cloudflare.md): crear el sitio en Cloudflare Web Analytics y guardar el token como variable `VITE_CF_ANALYTICS_TOKEN` del environment `production` de GitHub. Sin token, PDN funciona igual pero sin analítica (la build lo advierte). |
| 6   | Registrar el sitio en Google Search Console               | Dueño          | 17 oct 2026 | Después del paso a PDN (etapa 14): verificar la propiedad, enviar `https://conducirjrdelsinu.pages.dev/sitemap.xml` y revisar los resultados enriquecidos (escuela y preguntas frecuentes).                                            |
| 7   | El botón de WhatsApp se mueve al aparecer el aviso        | Desarrollo     | 17 oct 2026 | En móvil, el botón sube cuando el aviso de privacidad aparece tras cargar (CLS ≈ 0.05, dentro de lo "bueno" < 0.1). Mejora opcional: subirlo con una transformación en lugar de cambiar su posición.                                   |

## Resueltos

| #   | Pendiente                   | Resuelto    | Cómo                                                                                                                                                                                                                                                                    |
| --- | --------------------------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 4   | Peso del JavaScript inicial | 17 oct 2026 | Medido con Lighthouse (móvil, red lenta) sobre la build con prerender y compresión como Cloudflare: rendimiento 98–100, primera pintura 1.0–1.8 s y 0 ms de bloqueo. El prerender muestra la página antes de que llegue el JavaScript, así que no hace falta reducirlo. |
