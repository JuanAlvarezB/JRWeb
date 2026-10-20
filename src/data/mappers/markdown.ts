/** Utilidades de Markdown para el contenido legal (sin dependencias externas). */

const FRONTMATTER = /^---\n([\s\S]*?)\n---\n?/u;

/** Lee el bloque `---` inicial como pares clave: valor (valores entre comillas o sin ellas). */
export function parseFrontmatter(markdown: string): Record<string, string> {
  const block = FRONTMATTER.exec(markdown)?.[1];
  if (block === undefined) return {};
  const entries = block
    .split('\n')
    .map((line) => /^([\w-]+):\s*(.*)$/u.exec(line))
    .filter((match): match is RegExpExecArray => match !== null)
    .map((match) => [match[1] ?? '', (match[2] ?? '').replace(/^"|"$/gu, '')] as const);
  return Object.fromEntries(entries);
}

/** Texto sin el encabezado `---` ni los comentarios HTML (notas internas del archivo). */
export function stripFrontmatterAndComments(markdown: string): string {
  return markdown.replace(FRONTMATTER, '').replace(/<!--[\s\S]*?-->/gu, '');
}

/** Sección de primer nivel (`## Título`) con su contenido. */
export interface MarkdownSection {
  readonly title: string;
  readonly body: string;
}

/** Divide el texto en secciones `##`. Lo que esté antes del primer `##` se ignora. */
export function splitSections(markdown: string): MarkdownSection[] {
  return markdown
    .split(/^## /mu)
    .slice(1)
    .map((chunk) => {
      const newline = chunk.indexOf('\n');
      const title = (newline === -1 ? chunk : chunk.slice(0, newline)).trim();
      const body = newline === -1 ? '' : chunk.slice(newline + 1).trim();
      return { title, body };
    });
}
