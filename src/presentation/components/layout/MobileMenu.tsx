import { useEffect, useRef, type JSX } from 'react';
import { Link, NavLink } from 'react-router';
import { Button } from '@/presentation/components/ui/Button';
import { Icon } from '@/presentation/components/ui/Icon';
import { ROUTES } from '@/shared/constants/routes';
import { UI_TEXT } from '@/shared/constants/uiText';
import { cx } from '@/shared/utils/cx';
import { Logo } from './Logo';
import styles from './MobileMenu.module.css';
import { NAV_LINKS } from './navLinks';

interface MobileMenuProps {
  readonly open: boolean;
  readonly whatsAppHref: string;
  readonly callHref: string | undefined;
  /**
   * Se cerró. `returnFocus` es `true` con X o Esc (el foco vuelve a ☰) y `false` al
   * elegir una página (el foco pasa al contenido nuevo).
   */
  readonly onClose: (returnFocus: boolean) => void;
}

const { nav: TEXT } = UI_TEXT;

/**
 * Menú a pantalla completa (handoff §2) con `<dialog>` modal: el navegador atrapa el
 * foco y Esc lo cierra. Enlaces de 56 px y, abajo, WhatsApp y "Llamar" a todo el ancho.
 */
export function MobileMenu({
  open,
  whatsAppHref,
  callHref,
  onClose,
}: MobileMenuProps): JSX.Element {
  const dialog = useRef<HTMLDialogElement>(null);
  const navigating = useRef(false);

  useEffect(() => {
    const element = dialog.current;
    if (element === null) return;
    if (open && !element.open) element.showModal();
    if (!open && element.open) element.close();
  }, [open]);

  const close = (): void => {
    dialog.current?.close();
  };
  const closeForNavigation = (): void => {
    navigating.current = true;
    close();
  };

  return (
    <dialog
      ref={dialog}
      aria-label={TEXT.mobileMenuLabel}
      className={styles.menu}
      onClose={() => {
        onClose(!navigating.current);
        navigating.current = false;
      }}
    >
      <div className={styles.top}>
        <Link
          to={ROUTES.home}
          aria-label={TEXT.homeLink}
          onClick={closeForNavigation}
          className={styles.home}
        >
          <Logo variant="icon" alt="" className={styles.logo} />
        </Link>
        <button type="button" className={styles.close} aria-label={TEXT.closeMenu} onClick={close}>
          <Icon name="close" weight="bold" className={styles.closeIcon} />
        </button>
      </div>

      <nav aria-label={TEXT.label}>
        <ul className={styles.links}>
          {NAV_LINKS.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end
                onClick={closeForNavigation}
                className={({ isActive }) => cx(styles.link, isActive && styles.active)}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className={styles.actions}>
        <Button href={whatsAppHref} newTab icon="whatsapp" className={styles.action}>
          {TEXT.writeWhatsApp}
        </Button>
        {callHref !== undefined && (
          <Button href={callHref} variant="outline" icon="phone" className={styles.action}>
            {TEXT.call}
          </Button>
        )}
      </div>
    </dialog>
  );
}
