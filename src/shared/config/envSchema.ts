import { z } from './zod';

/** Ambientes soportados. Coinciden con los modos de Vite y los archivos `.env.[modo]`. */
export const ENV_NAMES = ['development', 'qa', 'production'] as const;

export type EnvName = (typeof ENV_NAMES)[number];

/** Configuración tipada del ambiente. Solo contiene valores públicos. */
export interface AppConfig {
  /** Ambiente actual. */
  readonly envName: EnvName;
  /** URL pública del propio ambiente, sin barra final. */
  readonly siteUrl: string;
  /** Token público del beacon de Cloudflare Web Analytics (solo PDN). */
  readonly analyticsToken: string | undefined;
  /** `true` solo en PDN con token configurado. */
  readonly analyticsEnabled: boolean;
  /** `true` solo en QA: muestra la etiqueta de ambiente y bloquea la indexación. */
  readonly isQa: boolean;
  /** `true` solo en PDN: el sitio es indexable. */
  readonly isProduction: boolean;
}

const envSchema = z.object({
  VITE_ENV_NAME: z.enum(ENV_NAMES),
  VITE_SITE_URL: z.url().refine((url) => !url.endsWith('/'), {
    message: 'VITE_SITE_URL no debe terminar en "/".',
  }),
  VITE_CF_ANALYTICS_TOKEN: z
    .string()
    .trim()
    .optional()
    .transform((token) => (token === undefined || token === '' ? undefined : token)),
});

/**
 * Valida las variables de entorno y devuelve la configuración tipada.
 *
 * @param rawEnv - Variables leídas de `import.meta.env` (navegador) o de `loadEnv` (scripts).
 * @throws {Error} Si falta una variable obligatoria o tiene un formato inválido.
 */
export function parseAppConfig(rawEnv: Readonly<Record<string, unknown>>): AppConfig {
  const result = envSchema.safeParse(rawEnv);
  if (!result.success) {
    throw new Error(`Variables de entorno inválidas:\n${z.prettifyError(result.error)}`);
  }
  const env = result.data;
  const isProduction = env.VITE_ENV_NAME === 'production';
  const analyticsToken = isProduction ? env.VITE_CF_ANALYTICS_TOKEN : undefined;

  return {
    envName: env.VITE_ENV_NAME,
    siteUrl: env.VITE_SITE_URL,
    analyticsToken,
    analyticsEnabled: analyticsToken !== undefined,
    isQa: env.VITE_ENV_NAME === 'qa',
    isProduction,
  };
}
