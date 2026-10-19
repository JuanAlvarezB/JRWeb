# Guía para actualizar el contenido

Cómo cambiar los datos del sitio: teléfonos, horarios, horas de los planes, preguntas frecuentes, calificación de Google y demás textos. Ningún cambio de contenido toca el código de las páginas: se editan archivos de datos y el sitio los muestra solo.

Todo cambio sigue el flujo normal: rama `feature/*` → PR hacia `qa` → revisión en QA → PR hacia `main` ([configuracion-github.md](configuracion-github.md), paso 9).

## 1. Antes de empezar

- **Sin precios.** Los precios se consultan por WhatsApp. El CI rechaza montos como `$850.000`, `850.000 pesos` o `COP` en cualquier archivo de contenido. Textos como "Consultar precio" sí son válidos.
- **Solo datos reales.** Nada de horarios, opiniones o cifras de ejemplo: el sitio es la información oficial de la escuela.
- **Repositorio público.** No escribas datos personales que no deban verse en la página (cédulas, correos personales, teléfonos privados).
- **Nombres en minúscula y sin tildes** para los `id` (`horario-teoricas`, no `Horario Teóricas`): son claves internas, no se muestran.

## 2. Dónde está cada cosa

Los datos están en `src/data/content/`.

| Archivo                | Qué contiene                                              | Dónde se ve                                                               |
| ---------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------- |
| `company.json`         | Razón social, NIT, misión, visión y diferenciadores       | Inicio (beneficios), Nosotros, footer y Política de datos                 |
| `contact.json`         | WhatsApp, llamadas, correo, redes y mensajes de WhatsApp  | Menú, botón flotante, Contáctanos, footer y todos los botones de WhatsApp |
| `location.json`        | Dirección, coordenadas, perfil de Google y mapa           | Inicio, Contáctanos, Nosotros, Preguntas frecuentes y footer              |
| `schedule.json`        | Horarios de clases teóricas y prácticas                   | Inicio, Nosotros, Contáctanos y footer                                    |
| `services.json`        | Las licencias A2, B1 y C1: vehículos, edad mínima y fotos | Servicios, Inicio y "Tu curso en horas"                                   |
| `plans.json`           | Horas de teoría, taller y manejo de cada licencia         | Planes, Inicio y "Tu curso en horas"                                      |
| `faq.json`             | Preguntas frecuentes                                      | Preguntas frecuentes y Planes                                             |
| `testimonials.json`    | Calificación de Google y opiniones                        | Inicio                                                                    |
| `legal/data-policy.md` | Política de Tratamiento de Datos (texto legal aprobado)   | Política de datos                                                         |

Los **textos fijos de la interfaz** (titular de Inicio, nombres de botones, títulos de sección, descripciones para Google) están en `src/shared/constants/uiText.ts`. Se editan igual: cambia solo el texto entre comillas.

## 3. Cambios frecuentes

### 3.1 Un número de WhatsApp o de llamadas

En `contact.json`, dentro del canal `whatsapp` o `phone`:

```json
{ "value": "+573165641048", "display": "+57 316 564 1048" }
```

- `value`: el número completo con `+57`, sin espacios. Es el que usan los enlaces.
- `display`: cómo se lee en pantalla.
- **El primer número de `whatsapp` es el principal**: lo usan el botón flotante, el menú y todos los botones "Escríbenos". Para cambiar cuál es el principal, cambia el orden.

### 3.2 Los mensajes que llegan por WhatsApp

En `contact.json`, sección `whatsAppMessages`:

| Mensaje               | Cuándo se usa                         |
| --------------------- | ------------------------------------- |
| `general`             | Botones "Escríbenos" de todo el sitio |
| `priceInquiry`        | "Consultar precio" en cada plan       |
| `requirementsInquiry` | "Consultar requisitos" en cada plan   |

`{categoria}` se reemplaza por la licencia (A2, B1 o C1). Debe quedar en los mensajes de precio y de requisitos.

### 3.3 Correo y redes sociales

En `contact.json`, canales `email`, `facebook`, `instagram` y `tiktok`. En las redes, `value` es la dirección completa (`https://…`) y `display` el nombre de usuario que se muestra.

### 3.4 Horarios de clases

En `schedule.json`, cada bloque tiene sus días y franjas:

```json
{
  "id": "theory-night",
  "kind": "theory",
  "days": ["monday", "tuesday", "wednesday"],
  "slots": [{ "start": "18:00", "end": "20:00" }]
}
```

- **Días** en inglés: `monday`, `tuesday`, `wednesday`, `thursday`, `friday`, `saturday`, `sunday`.
- **Horas** en formato de 24 horas (`18:00`). El sitio las muestra como "6:00 p. m.".
- **Prácticas** no tienen franjas fijas (`"slots": []`); su `note` es el texto que se muestra.

> **Importante:** la pregunta frecuente "¿En qué horarios son las clases teóricas?" (`horario-teoricas` en `faq.json`) repite los horarios en texto. Actualízala también; esta no la revisa el CI.

### 3.5 Horas de un plan

En `plans.json`, el bloque `hours` de la licencia:

```json
"hours": { "theory": 25, "workshop": 5, "driving": 20 }
```

El total ("50 horas") se calcula solo. La respuesta de "¿Cuántas horas dura cada curso?" (`horas` en `faq.json`) debe decir el total de cada licencia: **el CI falla si no coincide**, y el mensaje indica el texto exacto que falta.

### 3.6 Preguntas frecuentes

Cada pregunta de `faq.json`:

```json
{
  "id": "dias-practicas",
  "topic": "schedules",
  "order": 2,
  "question": "¿Qué días son las clases prácticas?",
  "answer": "De lunes a sábado. Escríbenos para coordinar tus clases de manejo.",
  "action": { "kind": "whatsapp", "label": "Escríbenos por WhatsApp" },
  "placements": []
}
```

| Campo        | Qué es                                                                                                                                                     |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`         | Identificador único (minúsculas y guiones). No cambies el de `horas`: el CI lo usa.                                                                        |
| `topic`      | Tema en que aparece: `courses` (cursos), `schedules` (horarios), `pricing` (precios) o `location` (ubicación).                                             |
| `order`      | Posición dentro del tema (1, 2, 3…).                                                                                                                       |
| `question`   | La pregunta, con signos de apertura y cierre.                                                                                                              |
| `answer`     | La respuesta. Sin precios.                                                                                                                                 |
| `action`     | Opcional. Un enlace bajo la respuesta: `whatsapp` (abre el chat), `directions` ("Cómo llegar") o `plans` (lleva a Planes). `label` es el texto del enlace. |
| `placements` | Otras páginas donde se repite. Hoy solo existe `plans`, con su propio `order`. `[]` si solo va en Preguntas frecuentes.                                    |

**Agregar una pregunta:** copia un bloque completo, pégalo después de otro (separado por una coma), cambia el `id` por uno nuevo y ajusta los demás campos.

### 3.7 Calificación y opiniones de Google

En `testimonials.json`:

- `rating.score` y `rating.reviewCount`: la calificación y el número de opiniones, como aparecen en Google.
- `rating.asOf`: la fecha en que los consultaste (`AAAA-MM-DD`). El sitio muestra "a octubre de 2026".
- `testimonials`: opiniones copiadas **textualmente** de Google. `author` es opcional (nombre e inicial del apellido, como "Cruz P."). `retrievedAt` es la fecha en que la copiaste.

`reviewsUrl` debe ser el mismo enlace que `googleProfileUrl` de `location.json`; el CI lo revisa.

### 3.8 Dirección y mapa

En `location.json`:

- `address`: calle, ciudad, departamento y país.
- `coordinates`: latitud y longitud. Las usan "Cómo llegar" y "Abrir en Waze". Para obtenerlas: en Google Maps, clic derecho sobre la sede → copia los dos números.
- `googleProfileUrl`: el enlace "Compartir" del perfil de la escuela en Google Maps.
- `embedUrl`: el mapa que carga al tocar "Ver mapa". En Google Maps: **Compartir** → **Insertar un mapa** → copia solo la dirección que está entre las comillas de `src="…"`.

### 3.9 Misión, visión y diferenciadores

En `company.json`. Los diferenciadores son las tarjetas de "Por qué estudiar con nosotros". Uno nuevo se agrega con su `id`, `title` y `description`, y muestra un ícono de check; si quieres otro ícono, pídelo al equipo de desarrollo.

**El NIT y la razón social** también aparecen en la Política de datos: si cambian, la política necesita una versión aprobada (sección 3.11).

### 3.10 Fotos de los servicios

Pendiente #1 de [pendientes.md](pendientes.md). Cuando existan fotos reales de la sede o los vehículos:

1. Guárdalas en `public/assets/servicios/` en formato `.webp`, horizontales (4:3) y de unos 1200 px de ancho.
2. En `services.json`, agrega a la licencia:

   ```json
   "photo": { "src": "/assets/servicios/b1.webp", "alt": "Automóvil de la escuela listo para la clase de manejo" }
   ```

   `alt` describe la foto para quien no la ve. Sin fotos de stock (DESIGN.md §6).

### 3.11 Política de Tratamiento de Datos

`legal/data-policy.md` es el texto oficial aprobado por el asesor legal. **No se edita sin una nueva versión aprobada.** Cuando llegue:

1. Reemplaza el texto respetando el formato: cada sección empieza con `## ` y el título.
2. Actualiza `effectiveDate` en el encabezado del archivo.
3. Conserva la sección "ANALÍTICA DEL SITIO WEB" y `analyticsSection: included`: el aviso de privacidad la anuncia.
4. Deja `status: approved`. Con otro estado, el PR hacia `main` no pasa.

## 4. Comprobar el cambio en tu equipo

```bash
npm run content:validate   # esquemas, precios y coherencia entre archivos
npm run dev                # http://localhost:5173: revisa la página que cambiaste
npm test                   # todas las pruebas
```

- **Si `content:validate` falla**, el mensaje dice el archivo, la posición (`[2].topic` es el campo `topic` del tercer bloque; se cuenta desde 0) y qué corregir. Los más comunes:

  | Mensaje                                      | Qué hacer                                                                 |
  | -------------------------------------------- | ------------------------------------------------------------------------- |
  | `Unexpected token` o `JSON`                  | Falta o sobra una coma o unas comillas. VS Code marca la línea en rojo.   |
  | `Unrecognized key`                           | Un campo mal escrito (p. ej. `questoin`). Copia el nombre de otro bloque. |
  | `Invalid option: expected one of …`          | Un valor fuera de la lista (`topic`, día de la semana, `kind`).           |
  | `Posible precio publicado`                   | Quita el monto: el precio se consulta por WhatsApp.                       |
  | La respuesta … debe decir "50 horas" para B1 | Actualiza la pregunta `horas` con el total nuevo (sección 3.5).           |

- **Si fallan pruebas**, puede ser normal: varias comprueban los datos reales a propósito (el número de WhatsApp, la dirección, las horas). El mensaje muestra el valor esperado y el recibido; si el recibido es tu dato nuevo, actualiza el valor esperado en esa prueba.
- **Capturas de referencia:** casi todo cambio visible cambia alguna captura y `visual-tests` falla en el PR. Es la señal para regenerarlas ([ambientes-y-despliegue.md](ambientes-y-despliegue.md), sección 2).

## 5. Publicar

1. Commit, push y PR hacia `qa` con tu `AB#`.
2. Con el CI en verde, integra con **Create a merge commit**. QA se actualiza solo.
3. Revisa el cambio en <https://qa.conducirjrdelsinu.pages.dev> con el [checklist de QA](checklist-pruebas-manuales-qa.md).
4. PR `qa` → `main`, integra y aprueba el despliegue. El sitio público se actualiza en unos minutos.
