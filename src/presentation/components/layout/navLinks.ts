import { ROUTES, type RoutePath } from '@/shared/constants/routes';
import { UI_TEXT } from '@/shared/constants/uiText';

export interface NavLinkItem {
  readonly to: RoutePath;
  readonly label: string;
}

/** Páginas del menú y del footer, en el orden de los mockups. */
export const NAV_LINKS: readonly NavLinkItem[] = [
  { to: ROUTES.home, label: UI_TEXT.nav.links.home },
  { to: ROUTES.about, label: UI_TEXT.nav.links.about },
  { to: ROUTES.services, label: UI_TEXT.nav.links.services },
  { to: ROUTES.plans, label: UI_TEXT.nav.links.plans },
  { to: ROUTES.faq, label: UI_TEXT.nav.links.faq },
  { to: ROUTES.contact, label: UI_TEXT.nav.links.contact },
];
