import { useRef, useState, type JSX } from 'react';
import { Link, NavLink } from 'react-router';
import { ActionLink } from '@/presentation/components/ui/ActionLink';
import { Button } from '@/presentation/components/ui/Button';
import { Icon } from '@/presentation/components/ui/Icon';
import { useContactChannels } from '@/presentation/hooks/useContactChannels';
import { useScrolledPast } from '@/presentation/hooks/useScrolledPast';
import { useWhatsAppLink } from '@/presentation/hooks/useWhatsAppLink';
import { NAV_COMPACT_SCROLL_THRESHOLD_PX } from '@/shared/constants/designTokens';
import { ROUTES } from '@/shared/constants/routes';
import { UI_TEXT } from '@/shared/constants/uiText';
import { cx } from '@/shared/utils/cx';
import styles from './Header.module.css';
import { Logo } from './Logo';
import { MobileMenu } from './MobileMenu';
import { NAV_LINKS } from './navLinks';

const { nav: TEXT } = UI_TEXT;

/**
 * Menú principal (DESIGN.md §5, handoff §2): fijo arriba sobre Blanco Cálido. En escritorio
 * mide 124 px con el logo completo y pasa a 72 px con el logo-ícono al bajar 80 px.
 * La barra es fija y el `<header>` conserva siempre el alto inicial: al encogerse, el
 * contenido no se mueve (si no, los saltos a una sección quedarían bajo el menú).
 * Cuando no caben los enlaces (celular y pantallas medianas), se abre el menú a
 * pantalla completa con ☰.
 */
export function Header(): JSX.Element {
  const compact = useScrolledPast(NAV_COMPACT_SCROLL_THRESHOLD_PX);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const whatsAppHref = useWhatsAppLink();
  const [phone] = useContactChannels(['phone']);
  const callHref = phone?.entries[0]?.href;

  return (
    <header className={cx(styles.header, compact && styles.compact)}>
      <div className={styles.bar}>
        <div className={styles.inner}>
          <Link to={ROUTES.home} className={styles.home} aria-label={TEXT.homeLink}>
            <Logo variant="horizontal" alt="" className={styles.logoFull} />
            <Logo variant="icon" alt="" className={styles.logoIcon} />
          </Link>

          <nav aria-label={TEXT.label} className={styles.nav}>
            <ul className={styles.links}>
              {NAV_LINKS.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    end
                    className={({ isActive }) => cx(styles.link, isActive && styles.active)}
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.actions}>
            {callHref !== undefined && (
              <ActionLink href={callHref} icon="phone" arrow={false} className={styles.call}>
                {TEXT.call}
              </ActionLink>
            )}
            <Button href={whatsAppHref} newTab icon="whatsapp" className={styles.write}>
              {TEXT.write}
            </Button>
            <button
              ref={menuButton}
              type="button"
              className={styles.menuButton}
              aria-label={TEXT.openMenu}
              aria-expanded={menuOpen}
              aria-haspopup="dialog"
              onClick={() => {
                setMenuOpen(true);
              }}
            >
              <Icon name="menu" weight="bold" className={styles.menuIcon} />
            </button>
          </div>
        </div>
      </div>

      <MobileMenu
        open={menuOpen}
        whatsAppHref={whatsAppHref}
        callHref={callHref}
        onClose={(returnFocus) => {
          setMenuOpen(false);
          if (returnFocus) menuButton.current?.focus();
        }}
      />
    </header>
  );
}
