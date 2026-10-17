/**
 * Validación del contenido publicado (job `content-validation` del CI).
 *
 * 1. Ningún precio en el contenido: los precios se consultan por WhatsApp.
 * 2. La Política de Tratamiento de Datos está aprobada e incluye la sección de
 *    analítica del sitio (el aviso de privacidad la anuncia).
 * 3. (Etapa de datos) Cada JSON de contenido cumple su esquema Zod.
 *
 * Uso: `tsx scripts/validate-content.ts`. Con `TARGET_BRANCH=main` (PR hacia PDN),
 * los problemas de la política son errores; hacia `qa` son advertencias.
 */
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

export const CONTENT_DIR = 'src/data/content';
export const DATA_POLICY_FILE = 'src/data/content/legal/data-policy.md';

/** Un hallazgo de precio: archivo, línea y texto encontrado. */
export interface PriceFinding {
  readonly file: string;
  readonly line: number;
  readonly match: string;
}

/**
 * Patrones de precio. Se buscan montos, no la palabra "precio": textos como
 * "Consultar precio" son válidos.
 */
const PRICE_PATTERNS: readonly RegExp[] = [
  /\$\s?\d/u,
  /\bCOP\b/u,
  /\d{1,3}(?:[.,]\d{3})+(?:\s*(?:pesos|cop|mil))?/iu,
  /\b\d+\s*(?:pesos|mil pesos)\b/iu,
  /"(?:price|precio|valor|costo|tarifa|amount)"\s*:\s*"?\d/iu,
];

/** Busca precios línea por línea en un texto. */
export function findPrices(file: string, text: string): PriceFinding[] {
  const findings: PriceFinding[] = [];
  text.split('\n').forEach((content, index) => {
    for (const pattern of PRICE_PATTERNS) {
      const match = pattern.exec(content);
      if (match !== null) {
        findings.push({ file, line: index + 1, match: match[0] });
        break;
      }
    }
  });
  return findings;
}

/** Lee el bloque `---` inicial de un Markdown como pares clave: valor. */
export function parseFrontmatter(markdown: string): Record<string, string> {
  const block = /^---\n([\s\S]*?)\n---/u.exec(markdown);
  if (block?.[1] === undefined) return {};
  const entries = block[1]
    .split('\n')
    .map((line) => /^([\w-]+):\s*(.*)$/u.exec(line))
    .filter((match): match is RegExpExecArray => match !== null)
    .map((match) => [match[1] ?? '', (match[2] ?? '').replace(/^"|"$/gu, '')] as const);
  return Object.fromEntries(entries);
}

/** Problemas de publicación de la política de datos (vacío = lista para PDN). */
export function checkDataPolicy(markdown: string): string[] {
  const meta = parseFrontmatter(markdown);
  const problems: string[] = [];
  if (meta.status !== 'approved') {
    problems.push('La política no está aprobada (status distinto de "approved").');
  }
  if (meta.analyticsSection !== 'included') {
    problems.push('La política no incluye la sección de analítica del sitio (analyticsSection).');
  }
  return problems;
}

async function listContentFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true, recursive: true });
  return entries
    .filter((entry) => entry.isFile() && /\.(json|md)$/u.test(entry.name))
    .map((entry) => path.join(entry.parentPath, entry.name));
}

async function main(): Promise<void> {
  const toProduction = process.env.TARGET_BRANCH === 'main';
  let errors = 0;

  // 1. Precios
  const files = await listContentFiles(CONTENT_DIR);
  for (const file of files) {
    for (const finding of findPrices(file, await readFile(file, 'utf8'))) {
      console.error(
        `::error file=${finding.file},line=${String(finding.line)}::Posible precio publicado: "${finding.match}". Los precios se consultan por WhatsApp.`,
      );
      errors += 1;
    }
  }
  console.log(`✓ Revisados ${String(files.length)} archivos de contenido en busca de precios.`);

  // 2. Política de datos
  const policyProblems = checkDataPolicy(await readFile(DATA_POLICY_FILE, 'utf8'));
  for (const problem of policyProblems) {
    console.log(`::${toProduction ? 'error' : 'warning'} file=${DATA_POLICY_FILE}::${problem}`);
    if (toProduction) errors += 1;
  }
  if (policyProblems.length === 0)
    console.log('✓ Política de datos aprobada y con sección de analítica.');

  if (errors > 0) {
    console.error(`✗ ${String(errors)} problema(s) en el contenido.`);
    process.exit(1);
  }
}

const executedDirectly =
  process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href;

if (executedDirectly) {
  main().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
}
