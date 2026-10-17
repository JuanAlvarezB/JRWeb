import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { usePageMeta } from '@/presentation/seo/usePageMeta';

const meta = (selector: string): string | null =>
  document.head.querySelector(selector)?.getAttribute('content') ?? null;

describe('usePageMeta', () => {
  it('actualiza título, descripción, Open Graph y canónica al cambiar de página', () => {
    const { rerender } = renderHook(
      ({ key }) => {
        usePageMeta(key);
      },
      {
        initialProps: { key: 'plans' as Parameters<typeof usePageMeta>[0] },
      },
    );
    expect(document.title).toBe('Planes · Conducir J&R del Sinú');
    expect(meta('meta[name="description"]')).toMatch(/^Planes de los cursos/u);
    expect(meta('meta[property="og:title"]')).toBe('Planes · Conducir J&R del Sinú');
    expect(document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href).toBe(
      'https://conducirjrdelsinu.pages.dev/planes',
    );

    rerender({ key: 'faq' });
    expect(document.title).toBe('Preguntas frecuentes · Conducir J&R del Sinú');
    expect(document.head.querySelectorAll('link[rel="canonical"]')).toHaveLength(1);
    expect(document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href).toBe(
      'https://conducirjrdelsinu.pages.dev/preguntas-frecuentes',
    );
  });

  it('la 404 no tiene canónica', () => {
    renderHook(() => {
      usePageMeta('notFound');
    });
    expect(document.title).toBe('Página no encontrada · Conducir J&R del Sinú');
    expect(document.head.querySelector('link[rel="canonical"]')).toBeNull();
  });
});
