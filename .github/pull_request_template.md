## Qué cambia

<!-- Resumen en una o dos frases. -->

## Trabajo en Azure Boards

<!-- Obligatorio. Escribe AB# y el número del elemento (ej. AB#42). Usa solo "AB#", no "Fixes AB#":
     la rama por defecto es qa y "Fixes" cerraría el elemento antes de llegar a PDN. -->

AB#

## Tipo de PR

- [ ] `feature/*` → `qa` (cambio nuevo)
- [ ] `qa` → `main` (paso a PDN)

## Antes de pedir la integración

- [ ] La rama trae el último `main` (`git pull --no-rebase origin main`).
- [ ] Ejecuté `npm run lint` y `npm run typecheck` sin errores.
- [ ] Ejecuté `npm test` sin errores.
- [ ] Cumple DESIGN.md: solo variables de diseño, roles de color respetados, una franja máximo por pantalla.
- [ ] No incluye contraseñas, llaves, tokens ni datos personales (el repositorio es público).

## Capturas (si hay cambios visuales)

<!-- Móvil (390 px) y escritorio (1440 px). Si cambian las capturas de referencia, explica por qué. -->

## Solo para `qa` → `main`

- [ ] Completé `docs/checklist-pruebas-manuales-qa.md` en QA y lo dejé marcado en un comentario.
- [ ] La regresión contra QA pasó en GitHub Actions.
