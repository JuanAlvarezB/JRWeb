import { useEffect } from 'react';
import { pageMeta, type PageKey } from './pageMeta';

function setMeta(
  selector: string,
  attribute: 'name' | 'property',
  key: string,
  value: string,
): void {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (element === null) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.append(element);
  }
  element.content = value;
}

/**
 * Actualiza el título y los metadatos al navegar dentro del sitio. El HTML de cada
 * página ya trae los suyos desde el prerender (los buscadores leen ese); esto
 * mantiene la pestaña y el historial correctos al cambiar de página sin recargar.
 */
export function usePageMeta(key: PageKey): void {
  useEffect(() => {
    const meta = pageMeta(key);
    document.title = meta.title;
    setMeta('meta[name="description"]', 'name', 'description', meta.description);
    setMeta('meta[property="og:title"]', 'property', 'og:title', meta.title);
    setMeta('meta[property="og:description"]', 'property', 'og:description', meta.description);
    const canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (meta.canonicalUrl === undefined) {
      canonical?.remove();
    } else if (canonical === null) {
      const link = document.createElement('link');
      link.rel = 'canonical';
      link.href = meta.canonicalUrl;
      document.head.append(link);
    } else {
      canonical.href = meta.canonicalUrl;
    }
  }, [key]);
}
