/**
 * Configuración global de Zod. Todo módulo que defina esquemas importa `z` desde
 * aquí, para que esta configuración se aplique antes de la primera validación.
 *
 * `jitless`: sin compilación con `new Function`. La CSP del sitio no permite `eval`,
 * y Firefox reporta la prueba de Zod como una violación aunque Zod la capture.
 */
import { z } from 'zod';

z.config({ jitless: true });

export { z };
