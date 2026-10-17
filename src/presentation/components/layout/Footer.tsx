import type { JSX } from 'react';
import { Link } from 'react-router';
import { findBlock } from '@/domain/entities/ClassSchedule';
import { SOCIAL_KINDS, type ContactChannelKind } from '@/domain/entities/ContactChannel';
import { Icon } from '@/presentation/components/ui/Icon';
import { Pressable } from '@/presentation/components/ui/Pressable';
import { formatDays, formatSlots } from '@/presentation/formatters/schedule';
import type { ContactChannelLinks } from '@/presentation/hooks/contactLinks';
import { useCompanyInfo } from '@/presentation/hooks/useCompanyInfo';
import { useContactChannels } from '@/presentation/hooks/useContactChannels';
import { useSchedule } from '@/presentation/hooks/useSchedule';
import { useSchoolLocation } from '@/presentation/hooks/useSchoolLocation';
import { BUILD_YEAR } from '@/shared/config/build';
import { ROUTES } from '@/shared/constants/routes';
import { UI_TEXT } from '@/shared/constants/uiText';
import styles from './Footer.module.css';
import { Logo } from './Logo';
import { NAV_LINKS } from './navLinks';

const { footer: TEXT } = UI_TEXT;
const COMPACT = { compact: true } as const;

/**
 * Footer (DESIGN.md §5, handoff §2): Marfil con divisor Niebla, sin banda oscura.
 * Logo · Páginas · Contacto · Horarios de clases · Redes, y la barra con el NIT y la
 * Política de Tratamiento de Datos. En móvil: Contacto y Horarios primero (cada
 * horario en una línea, "Prácticas: lunes a sábado") y Páginas y Redes en dos columnas.
 */
export function Footer(): JSX.Element {
  const { brandName, nit } = useCompanyInfo();
  const channels = useContactChannels();
  const byKind = (kind: ContactChannelKind): ContactChannelLinks | undefined =>
    channels.find((channel) => channel.kind === kind);
  // Los mismos números son WhatsApp y llamadas: el footer los enlaza para llamar.
  const phones = byKind('phone') ?? byKind('whatsapp');
  const email = byKind('email');
  const social = channels.filter((channel) => SOCIAL_KINDS.includes(channel.kind));
  const schedule = useSchedule();
  const location = useSchoolLocation();
  const day = findBlock(schedule, 'theory-day');
  const night = findBlock(schedule, 'theory-night');
  const practice = findBlock(schedule, 'practice');

  return (
    <footer className={styles.footer}>
      <div className={styles.grid}>
        <Link to={ROUTES.home} aria-label={UI_TEXT.nav.homeLink} className={styles.brand}>
          <Logo variant="horizontal" alt="" className={styles.logo} />
        </Link>

        <nav aria-labelledby="footer-paginas" className={styles.pages}>
          <h2 id="footer-paginas" className={styles.heading}>
            {TEXT.pages}
          </h2>
          <ul className={styles.list}>
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className={styles.link}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <section aria-labelledby="footer-contacto" className={styles.contact}>
          <h2 id="footer-contacto" className={styles.heading}>
            {TEXT.contact}
          </h2>
          <ul className={styles.list}>
            {phones !== undefined && <li className={styles.caption}>{TEXT.phonesLabel}</li>}
            {phones?.entries.map((entry) => (
              <li key={entry.value}>
                <a href={entry.href} className={styles.link}>
                  {entry.display}
                </a>
              </li>
            ))}
            {email?.entries.map((entry) => (
              <li key={entry.value}>
                <a href={entry.href} className={styles.link}>
                  {entry.display}
                </a>
              </li>
            ))}
            <li>
              <Pressable
                href={location.googleProfileUrl ?? location.directionsUrl}
                newTab
                className={styles.address}
              >
                <Icon name="mapPin" className={styles.pin} />
                <span>{location.shortAddress}</span>
              </Pressable>
            </li>
          </ul>
        </section>

        <section aria-labelledby="footer-horarios" className={styles.schedules}>
          <h2 id="footer-horarios" className={styles.heading}>
            {TEXT.schedules}
          </h2>
          <dl className={styles.scheduleList}>
            {day !== undefined && (
              <div>
                <dt>{TEXT.theoryDay(formatDays(day.days, 'short'))}</dt>
                <dd>{formatSlots(day, COMPACT)}</dd>
              </div>
            )}
            {night !== undefined && (
              <div>
                <dt>{TEXT.theoryNight}</dt>
                <dd>
                  {formatDays(night.days, 'short')}, {formatSlots(night, COMPACT)}
                </dd>
              </div>
            )}
            {practice !== undefined && (
              <div>
                <dt>{TEXT.practice}</dt>
                <dd>{formatDays(practice.days)}</dd>
              </div>
            )}
          </dl>
        </section>

        <nav aria-labelledby="footer-redes" className={styles.social}>
          <h2 id="footer-redes" className={styles.heading}>
            {TEXT.social}
          </h2>
          <ul className={styles.list}>
            {social.flatMap((channel) =>
              channel.entries.map((entry) => (
                <li key={entry.value}>
                  <Pressable href={entry.href} newTab className={styles.link}>
                    {channel.label}
                  </Pressable>
                </li>
              )),
            )}
          </ul>
        </nav>
      </div>

      <div className={styles.bottom}>
        <p>{TEXT.copyright(BUILD_YEAR, brandName, nit)}</p>
        <Link to={ROUTES.dataPolicy} className={styles.policy}>
          {TEXT.dataPolicy}
        </Link>
      </div>
    </footer>
  );
}
