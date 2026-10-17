import { describe, expect, it } from 'vitest';
import { nextCategory } from '@/presentation/components/features/CourseHoursExplorer';
import { formatLegalHeading } from '@/presentation/formatters/legal';
import {
  parseInline,
  parseMarkdownBlocks,
  type InlineNode,
} from '@/presentation/formatters/markdown';
import { formatLongDate, toSentenceCase } from '@/presentation/formatters/text';
import { readContent } from '../data/readContent';
import { mapDataPolicy } from '@/data/mappers/dataPolicyMapper';

describe('parseInline', () => {
  it('negrillas y correos o URL entre <…> como enlaces', () => {
    expect(parseInline('el **CENTRO** escribe a <conducirdelsinu@gmail.com>.')).toEqual([
      { type: 'text', text: 'el ' },
      { type: 'strong', children: [{ type: 'text', text: 'CENTRO' }] },
      { type: 'text', text: ' escribe a ' },
      { type: 'link', href: 'mailto:conducirdelsinu@gmail.com', text: 'conducirdelsinu@gmail.com' },
      { type: 'text', text: '.' },
    ]);
    expect(parseInline('<https://www.sic.gov.co>')).toEqual([
      { type: 'link', href: 'https://www.sic.gov.co', text: 'https://www.sic.gov.co' },
    ]);
  });

  it('el texto sin formato queda igual (no se interpreta como HTML)', () => {
    expect(parseInline('a < b y <script>')).toEqual([{ type: 'text', text: 'a < b y <script>' }]);
  });
});

describe('parseMarkdownBlocks', () => {
  it('párrafos (las líneas seguidas se unen) y listas con viñetas', () => {
    expect(parseMarkdownBlocks('Uno\ndos.\n\n- a\n- **b**')).toEqual([
      { type: 'paragraph', content: [{ type: 'text', text: 'Uno dos.' }] },
      {
        type: 'list',
        ordered: false,
        start: 1,
        items: [
          [{ type: 'text', text: 'a' }],
          [{ type: 'strong', children: [{ type: 'text', text: 'b' }] }],
        ],
      },
    ]);
  });

  it('listas numeradas conservan el número inicial; una línea de texto continúa el elemento', () => {
    const [list] = parseMarkdownBlocks('3. tres\nsigue\n4. cuatro');
    expect(list).toEqual({
      type: 'list',
      ordered: true,
      start: 3,
      items: [[{ type: 'text', text: 'tres sigue' }], [{ type: 'text', text: 'cuatro' }]],
    });
  });

  it('un párrafo seguido de una lista en el mismo bloque se separan', () => {
    const blocks = parseMarkdownBlocks('Son derechos:\n1. Conocer\n2. Actualizar');
    expect(blocks.map((block) => block.type)).toEqual(['paragraph', 'list']);
  });

  it('la política real se convierte sin perder texto', async () => {
    const policy = mapDataPolicy(await readContent('legal/data-policy.md'));
    const textOf = (nodes: readonly InlineNode[]): string =>
      nodes.map((node) => (node.type === 'strong' ? textOf(node.children) : node.text)).join('');
    for (const section of policy.sections) {
      const rendered = parseMarkdownBlocks(section.body)
        .flatMap((block) => (block.type === 'paragraph' ? [block.content] : block.items))
        .map(textOf)
        .join(' ');
      const plain = section.body
        .replace(/\*\*/gu, '')
        .replace(/<([^>]+)>/gu, '$1')
        .replace(/^\s*(?:[-*]|\d+\.)\s+/gmu, '')
        .replace(/\s+/gu, ' ')
        .trim();
      expect(rendered.replace(/\s+/gu, ' ').trim()).toBe(plain);
    }
  });
});

describe('títulos y fechas de la política', () => {
  it('formatLegalHeading: número con espacio, tipo oración y sin punto final', () => {
    expect(formatLegalHeading('1.MARCO NORMATIVO E IDENTIFICACIÓN DEL RESPONSABLE')).toBe(
      '1. Marco normativo e identificación del responsable',
    );
    expect(formatLegalHeading('13. PRUEBA DE LA AUTORIZACIÓN.')).toBe(
      '13. Prueba de la autorización',
    );
    expect(formatLegalHeading('ANALÍTICA DEL SITIO WEB')).toBe('Analítica del sitio web');
  });

  it('toSentenceCase y formatLongDate', () => {
    expect(toSentenceCase('ÁMBITO DE APLICACIÓN')).toBe('Ámbito de aplicación');
    expect(formatLongDate('2024-01-15')).toBe('15 de enero de 2024');
  });
});

describe('nextCategory (selector "Tu curso en horas")', () => {
  const categories = ['A2', 'B1', 'C1'] as const;

  it('flechas con vuelta, Inicio y Fin; otras teclas no mueven', () => {
    expect(nextCategory(categories, 'B1', 'ArrowRight')).toBe('C1');
    expect(nextCategory(categories, 'C1', 'ArrowDown')).toBe('A2');
    expect(nextCategory(categories, 'A2', 'ArrowLeft')).toBe('C1');
    expect(nextCategory(categories, 'B1', 'ArrowUp')).toBe('A2');
    expect(nextCategory(categories, 'B1', 'Home')).toBe('A2');
    expect(nextCategory(categories, 'A2', 'End')).toBe('C1');
    expect(nextCategory(categories, 'B1', 'Enter')).toBeUndefined();
    expect(nextCategory([], 'B1', 'ArrowRight')).toBeUndefined();
  });
});
