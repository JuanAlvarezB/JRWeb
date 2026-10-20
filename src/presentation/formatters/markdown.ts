/**
 * Markdown mínimo para el texto legal: párrafos, listas (con viñetas o numeradas),
 * negrillas y correos o URL entre `<…>`. Devuelve datos, no HTML: React los pinta
 * como elementos, así que el texto nunca se inserta como HTML.
 */

export type InlineNode =
  | { readonly type: 'text'; readonly text: string }
  | { readonly type: 'strong'; readonly children: readonly InlineNode[] }
  | { readonly type: 'link'; readonly href: string; readonly text: string };

export type MarkdownBlock =
  | { readonly type: 'paragraph'; readonly content: readonly InlineNode[] }
  | {
      readonly type: 'list';
      readonly ordered: boolean;
      /** Número del primer elemento (listas numeradas que continúan). */
      readonly start: number;
      readonly items: readonly (readonly InlineNode[])[];
    };

const BULLET_ITEM = /^[-*]\s+(.*)$/u;
const NUMBERED_ITEM = /^(\d+)\.\s+(.*)$/u;
const STRONG_OR_AUTOLINK = /\*\*(.+?)\*\*|<((?:https?:\/\/)[^\s<>]+|[^\s<>@]+@[^\s<>]+)>/gu;

function autolinkHref(target: string): string {
  return target.includes('@') && !target.startsWith('http') ? `mailto:${target}` : target;
}

/** Texto en línea: `**negrilla**` y `<correo@dominio>` o `<https://…>`. */
export function parseInline(text: string): InlineNode[] {
  const nodes: InlineNode[] = [];
  let last = 0;
  for (const match of text.matchAll(STRONG_OR_AUTOLINK)) {
    if (match.index > last) nodes.push({ type: 'text', text: text.slice(last, match.index) });
    const [, strong, autolink] = match;
    if (strong !== undefined) {
      nodes.push({ type: 'strong', children: parseInline(strong) });
    } else if (autolink !== undefined) {
      nodes.push({ type: 'link', href: autolinkHref(autolink), text: autolink });
    }
    last = match.index + match[0].length;
  }
  if (last < text.length) nodes.push({ type: 'text', text: text.slice(last) });
  return nodes;
}

type Line =
  | { readonly kind: 'bullet' | 'numbered'; readonly number: number; readonly text: string }
  | { readonly kind: 'text'; readonly text: string };

function classify(line: string): Line {
  const bullet = BULLET_ITEM.exec(line);
  if (bullet !== null) return { kind: 'bullet', number: 1, text: bullet[1] ?? '' };
  const numbered = NUMBERED_ITEM.exec(line);
  if (numbered !== null) {
    return { kind: 'numbered', number: Number(numbered[1]), text: numbered[2] ?? '' };
  }
  return { kind: 'text', text: line };
}

/**
 * Bloques de una sección. Los bloques se separan por líneas en blanco; dentro de un
 * bloque, las líneas seguidas del mismo tipo de lista forman una lista y una línea de
 * texto después de un elemento continúa ese elemento.
 */
export function parseMarkdownBlocks(markdown: string): MarkdownBlock[] {
  const blocks: MarkdownBlock[] = [];
  for (const chunk of markdown.split(/\n\s*\n/u)) {
    let paragraph: string[] = [];
    let list: { ordered: boolean; start: number; items: string[] } | undefined;

    const flushParagraph = (): void => {
      if (paragraph.length > 0) {
        blocks.push({ type: 'paragraph', content: parseInline(paragraph.join(' ')) });
      }
      paragraph = [];
    };
    const flushList = (): void => {
      if (list !== undefined) {
        blocks.push({
          type: 'list',
          ordered: list.ordered,
          start: list.start,
          items: list.items.map(parseInline),
        });
      }
      list = undefined;
    };

    for (const raw of chunk.split('\n')) {
      const line = classify(raw.trim());
      if (line.kind === 'text') {
        if (line.text === '') continue;
        if (list === undefined) {
          paragraph.push(line.text);
        } else {
          const lastIndex = list.items.length - 1;
          list.items[lastIndex] = `${list.items[lastIndex] ?? ''} ${line.text}`;
        }
        continue;
      }
      const ordered = line.kind === 'numbered';
      flushParagraph();
      if (list?.ordered !== ordered) {
        flushList();
        list = { ordered, start: line.number, items: [] };
      }
      list.items.push(line.text);
    }
    flushParagraph();
    flushList();
  }
  return blocks;
}
