import type { JSX } from 'react';
import {
  parseMarkdownBlocks,
  type InlineNode,
  type MarkdownBlock,
} from '@/presentation/formatters/markdown';
import { cx } from '@/shared/utils/cx';
import styles from './MarkdownText.module.css';

function Inline({ nodes }: { readonly nodes: readonly InlineNode[] }): JSX.Element {
  return (
    <>
      {nodes.map((node, index) => {
        const key = `${node.type}-${String(index)}`;
        switch (node.type) {
          case 'text':
            return <span key={key}>{node.text}</span>;
          case 'strong':
            return (
              <strong key={key}>
                <Inline nodes={node.children} />
              </strong>
            );
          case 'link':
            return (
              <a key={key} href={node.href}>
                {node.text}
              </a>
            );
        }
      })}
    </>
  );
}

function Block({ block }: { readonly block: MarkdownBlock }): JSX.Element {
  if (block.type === 'paragraph') {
    return (
      <p>
        <Inline nodes={block.content} />
      </p>
    );
  }
  const items = block.items.map((item, index) => (
    <li key={index}>
      <Inline nodes={item} />
    </li>
  ));
  return block.ordered ? (
    <ol start={block.start === 1 ? undefined : block.start}>{items}</ol>
  ) : (
    <ul>{items}</ul>
  );
}

interface MarkdownTextProps {
  /** Markdown de una sección (subconjunto de `formatters/markdown.ts`). */
  readonly markdown: string;
  readonly className?: string | undefined;
}

/** Texto largo con formato (política de datos): párrafos y listas legibles. */
export function MarkdownText({ markdown, className }: MarkdownTextProps): JSX.Element {
  return (
    <div className={cx(styles.text, className)}>
      {parseMarkdownBlocks(markdown).map((block, index) => (
        <Block key={index} block={block} />
      ))}
    </div>
  );
}
