// @ts-check
import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/** Mensaje común para las reglas de arquitectura (ver README, sección Arquitectura). */
const LAYER_RULE = 'Regla de dependencias: presentation -> domain <- data.';

export default defineConfig([
  globalIgnores([
    'dist/',
    'coverage/',
    'playwright-report/',
    'test-results/',
    'insumos/',
    'node_modules/',
  ]),

  js.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ['eslint.config.js', 'stylelint.config.js'],
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  // React, hooks y accesibilidad
  {
    files: ['src/**/*.{ts,tsx}', 'tests/**/*.{ts,tsx}'],
    ...react.configs.flat.recommended,
    languageOptions: {
      ...react.configs.flat.recommended?.languageOptions,
      globals: { ...globals.browser },
    },
    settings: { react: { version: 'detect' } },
  },
  {
    files: ['src/**/*.{ts,tsx}', 'tests/**/*.{ts,tsx}'],
    ...react.configs.flat['jsx-runtime'],
  },
  reactHooks.configs.flat['recommended-latest'],
  {
    files: ['src/**/*.tsx', 'tests/**/*.tsx'],
    ...jsxA11y.flatConfigs.strict,
  },

  // Código limpio
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],
      'react/jsx-no-literals': 'off',
      'no-console': ['error', { allow: ['warn', 'error'] }],
    },
  },
  {
    files: ['src/**/*.tsx', 'tests/**/*.tsx'],
    rules: {
      // Safari/VoiceOver quita la semántica de lista a <ul> sin viñetas: role="list" la restaura.
      'jsx-a11y/no-redundant-roles': ['error', { ul: ['list'], ol: ['list'] }],
    },
  },

  // Arquitectura: el dominio es TypeScript puro.
  {
    files: ['src/domain/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              regex: '^(?!@/domain/|\\.{1,2}/)',
              message: `${LAYER_RULE} El dominio solo importa archivos del dominio (sin React ni librerías externas).`,
            },
          ],
        },
      ],
    },
  },
  // Arquitectura: la capa de datos no conoce React ni la presentación.
  {
    files: ['src/data/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              regex: '^(react|react-dom|react-router)(/|$)|^@/(presentation|di)/',
              message: `${LAYER_RULE} La capa de datos no importa React, presentación ni el contenedor.`,
            },
          ],
        },
      ],
    },
  },
  // Arquitectura: la presentación nunca importa data/ ni el contenedor.
  {
    files: ['src/presentation/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              regex: '^@/(data|di)/',
              message: `${LAYER_RULE} Los componentes usan hooks; los datos llegan por el DependencyProvider.`,
            },
          ],
        },
      ],
    },
  },
  // Arquitectura: shared es transversal y no depende de capas superiores.
  {
    files: ['src/shared/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              regex: '^@/(data|di|presentation)/',
              message: 'shared/ no depende de data, di ni presentation.',
            },
          ],
        },
      ],
    },
  },

  // Archivos de configuración y scripts de Node
  {
    files: ['*.config.{js,ts}', 'scripts/**/*.ts'],
    languageOptions: { globals: { ...globals.node } },
    rules: { 'no-console': 'off' },
  },
  {
    files: ['**/*.js'],
    ...tseslint.configs.disableTypeChecked,
  },

  prettier,
]);
