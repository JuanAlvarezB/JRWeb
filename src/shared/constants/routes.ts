/**
 * Rutas públicas del sitio. Es la única fuente de las URL internas:
 * el router, el menú, el footer, el aviso de privacidad y el sitemap las leen de aquí.
 */
export const ROUTES = {
  home: '/',
  about: '/nosotros',
  services: '/servicios',
  plans: '/planes',
  contact: '/contactanos',
  faq: '/preguntas-frecuentes',
  dataPolicy: '/politica-de-tratamiento-de-datos',
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];
