import { parseAppConfig, type AppConfig } from './envSchema';

/** Configuración del ambiente actual, validada al cargar la aplicación. */
export const appConfig: AppConfig = parseAppConfig(import.meta.env);
