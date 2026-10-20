import { describe, expect, it } from 'vitest';
import { createQueryClient } from '@/presentation/providers/queryClient';
import { restoreQueryState, serializeQueryState } from '@/presentation/providers/queryState';
import { QUERY_STATE_ELEMENT_ID } from '@/shared/prerender';

describe('caché de consultas del prerender', () => {
  it('se serializa sin poder cerrar la etiqueta y se restaura en el cliente', () => {
    const server = createQueryClient();
    server.setQueryData(['plans'], [{ name: '</script><script>alert(1)</script>' }]);
    const json = serializeQueryState(server);
    expect(json).not.toContain('</script>');

    const element = document.createElement('script');
    element.id = QUERY_STATE_ELEMENT_ID;
    element.type = 'application/json';
    element.textContent = json;
    document.body.append(element);

    const client = createQueryClient();
    expect(restoreQueryState(client)).toBe(true);
    expect(client.getQueryData(['plans'])).toEqual([
      { name: '</script><script>alert(1)</script>' },
    ]);
    expect(document.getElementById(QUERY_STATE_ELEMENT_ID)).toBeNull();
  });

  it('sin prerender (DEV) no hay nada que restaurar', () => {
    expect(restoreQueryState(createQueryClient())).toBe(false);
  });
});
