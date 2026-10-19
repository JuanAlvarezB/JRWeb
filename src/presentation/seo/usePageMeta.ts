import { useEffect } from 'react';
import { socialTags, type SocialTag } from './headTags';
import { pageMeta, type PageKey } from './pageMeta';

const OG_URL: Pick<SocialTag, 'attribute' | 'key'> = { attribute: 'property', key: 'og:url' };

const metaSelector = ({ attribute, key }: Pick<SocialTag, 'attribute' | 'key'>): string =>
  `meta[${attribute}="${key}"]`;

function setMeta(tag: SocialTag): void {
  let element = document.head.querySelector<HTMLMetaElement>(metaSelector(tag));
  if (element === null) {
    element = document.createElement('meta');
    element.setAttribute(tag.attribute, tag.key);
    document.head.append(element);
  }
  element.content = tag.content;
}

/**
 * Actualiza el título y los metadatos al navegar dentro del sitio. El HTML de cada
 * página ya trae los suyos desde el prerender (los buscadores y los robots de las
 * redes leen ese); esto mantiene la pestaña, el historial y las etiquetas para
 * compartir correctos al cambiar de página sin recargar.
 */
export function usePageMeta(key: PageKey): void {
  useEffect(() => {
    const meta = pageMeta(key);
    document.title = meta.title;
    setMeta({ attribute: 'name', key: 'description', content: meta.description });
    socialTags(meta).forEach(setMeta);
    const canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (meta.canonicalUrl === undefined) {
      // La 404 no declara la URL de otra página.
      canonical?.remove();
      document.head.querySelector(metaSelector(OG_URL))?.remove();
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
