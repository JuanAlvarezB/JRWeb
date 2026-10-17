# Regresión visual

`pages.spec.ts` toma cada página completa a 1440 y 390 px (los anchos de los mockups) y la compara con su captura de referencia (tolerancia del 2 %).

- **Las referencias se generan en Linux**, igual que en el CI, con el workflow manual "Actualizar capturas de referencia" (`docs/ambientes-y-despliegue.md`, sección 2). Se revisan en el PR.
- **Capturas locales:** en Mac o Windows, `npm run test:visual:update` genera capturas con el sufijo del sistema (`-darwin.png`). Sirven para revisar en tu equipo, pero git las ignora.
- **Cuándo actualizarlas:** solo cuando el cambio de diseño o de contenido es intencional.
