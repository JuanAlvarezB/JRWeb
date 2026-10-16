/**
 * Genera las variables de diseño desde `design-tokens/` con Style Dictionary.
 *
 * - `src/styles/variables.css`: todas las variables CSS (las usan los CSS Modules).
 * - `src/shared/constants/designTokens.ts`: los pocos valores que necesita JavaScript.
 *
 * Uso: `npm run tokens` (escribe) o `npm run tokens:check` (falla si los archivos
 * generados no coinciden con los tokens, p. ej. por una edición manual).
 */
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { parseArgs } from 'node:util';
import StyleDictionary from 'style-dictionary';
import type { TransformedToken } from 'style-dictionary/types';

const ROOT = process.cwd();
const CSS_FILE = 'src/styles/variables.css';
const TS_FILE = 'src/shared/constants/designTokens.ts';
const GENERATED_FILES = [CSS_FILE, TS_FILE];

/** Tokens que JavaScript necesita (nombre del token → nombre de la constante). */
const JS_TOKENS: Record<string, string> = {
  'component-nav-compact-scroll-threshold': 'NAV_COMPACT_SCROLL_THRESHOLD_PX',
  'motion-duration-copied': 'COPIED_FEEDBACK_DURATION_MS',
  'breakpoint-layout': 'LAYOUT_BREAKPOINT_PX',
};

const HEADER = [
  'ARCHIVO GENERADO por scripts/build-tokens.ts desde design-tokens/.',
  'No editar a mano: cambia DESIGN.md y los tokens, y ejecuta `npm run tokens`.',
];

function toNumber(value: unknown): number {
  const parsed = Number.parseFloat(String(value));
  if (Number.isNaN(parsed)) {
    throw new Error(`El token debe ser numérico: ${String(value)}`);
  }
  return parsed;
}

/**
 * Familia tipográfica CSS. Si la referencia ya llega transformada (texto), se usa tal cual;
 * si llega como lista, se ponen comillas a los nombres con espacios.
 */
function formatFontFamily(family: unknown): string {
  if (!Array.isArray(family)) return String(family);
  return family
    .map((name) => (/\s/.test(String(name)) ? `'${String(name)}'` : String(name)))
    .join(', ');
}

/** Nombre estable del token (ruta en kebab-case), igual en todas las plataformas. */
function tokenPath(token: TransformedToken): string {
  return token.path.join('-');
}

/** Valor compuesto de un token de tipografía (formato DTCG). */
interface TypographyValue {
  fontFamily: unknown;
  fontWeight: unknown;
  fontSize: unknown;
  lineHeight: unknown;
}

/**
 * Shorthand `font` de los tokens de tipografía. `letter-spacing` no forma parte del
 * shorthand en CSS; se usa con sus propias variables (`--font-letter-spacing-*`).
 */
StyleDictionary.registerTransform({
  name: 'jr/typography/css/shorthand',
  type: 'value',
  transitive: true,
  filter: (token: TransformedToken) => (token.$type ?? token.type) === 'typography',
  transform: (token: TransformedToken) => {
    const value = (token.$value ?? token.value) as TypographyValue;
    return `${String(value.fontWeight)} ${String(value.fontSize)}/${String(value.lineHeight)} ${formatFontFamily(value.fontFamily)}`;
  },
});

const CSS_TRANSFORMS = [
  ...(StyleDictionary.hooks.transformGroups.css ?? []).filter(
    (name) => name !== 'typography/css/shorthand',
  ),
  'jr/typography/css/shorthand',
];

StyleDictionary.registerFileHeader({
  name: 'jr/header',
  fileHeader: () => HEADER,
});

StyleDictionary.registerFormat({
  name: 'jr/typescript-constants',
  format: ({ dictionary }) => {
    const lines = dictionary.allTokens
      .filter((token: TransformedToken) => tokenPath(token) in JS_TOKENS)
      .sort((a: TransformedToken, b: TransformedToken) => tokenPath(a).localeCompare(tokenPath(b)))
      .map((token: TransformedToken) => {
        const constant = JS_TOKENS[tokenPath(token)] ?? token.name;
        const description = typeof token.$description === 'string' ? token.$description : '';
        return `/** ${description || tokenPath(token)} */\nexport const ${constant} = ${toNumber(token.$value)};`;
      });
    return [`// ${HEADER[0]}`, `// ${HEADER[1]}`, '', ...lines, ''].join('\n');
  },
});

function createDictionary(buildPath: string): StyleDictionary {
  return new StyleDictionary({
    source: ['design-tokens/tokens.json', 'design-tokens/components.json'],
    log: { verbosity: 'silent', warnings: 'error' },
    platforms: {
      css: {
        transforms: CSS_TRANSFORMS,
        buildPath: `${buildPath}/src/styles/`,
        files: [
          {
            destination: 'variables.css',
            format: 'css/variables',
            options: { fileHeader: 'jr/header', outputReferences: false },
          },
        ],
      },
      ts: {
        transformGroup: 'js',
        buildPath: `${buildPath}/src/shared/constants/`,
        files: [{ destination: 'designTokens.ts', format: 'jr/typescript-constants' }],
      },
    },
  });
}

async function main(): Promise<void> {
  const { values } = parseArgs({ options: { check: { type: 'boolean', default: false } } });

  if (!values.check) {
    await createDictionary(ROOT).buildAllPlatforms();
    console.log(`✓ Tokens generados: ${GENERATED_FILES.join(', ')}`);
    return;
  }

  // Modo verificación: genera en una carpeta temporal y compara.
  const tmpDir = path.join(ROOT, 'node_modules', '.tmp', 'tokens-check');
  await createDictionary(tmpDir).buildAllPlatforms();
  const outdated: string[] = [];
  for (const file of GENERATED_FILES) {
    const [expected, current] = await Promise.all([
      readFile(path.join(tmpDir, file), 'utf8'),
      readFile(path.join(ROOT, file), 'utf8').catch(() => ''),
    ]);
    if (expected !== current) outdated.push(file);
  }
  if (outdated.length > 0) {
    console.error(
      `✗ Archivos generados desactualizados o editados a mano: ${outdated.join(', ')}.\n  Ejecuta "npm run tokens".`,
    );
    process.exit(1);
  }
  console.log('✓ Las variables generadas coinciden con design-tokens/.');
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
