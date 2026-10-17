import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

/**
 * Pruebas con Vitest (docs/ambientes-y-despliegue.md, "Pruebas").
 *
 * - `unit`: TypeScript puro en Node (dominio, utilidades, scripts). Mide cobertura;
 *   el dominio debe tener al menos 80 % (si baja, la prueba falla).
 * - `components`: componentes React en jsdom con Testing Library.
 */
export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      // Mismos valores públicos que DEV (.env.development): el layout valida el entorno.
      env: {
        VITE_ENV_NAME: 'development',
        VITE_SITE_URL: 'http://localhost:5173',
      },
      projects: [
        {
          extends: true,
          test: {
            name: 'unit',
            environment: 'node',
            include: ['tests/unit/**/*.test.ts'],
          },
        },
        {
          extends: true,
          test: {
            name: 'components',
            environment: 'jsdom',
            include: ['tests/components/**/*.test.tsx'],
            setupFiles: ['tests/components/setup.ts'],
          },
        },
      ],
      coverage: {
        provider: 'v8',
        include: ['src/domain/**', 'src/shared/**', 'src/data/**', 'src/di/**', 'scripts/**'],
        exclude: ['src/shared/constants/designTokens.ts', 'src/data/content/**', '**/*.d.ts'],
        reporter: ['text-summary', 'json-summary', 'html'],
        reportsDirectory: 'coverage',
        thresholds: {
          'src/domain/**': { lines: 80, functions: 80, branches: 80, statements: 80 },
        },
      },
    },
  }),
);
