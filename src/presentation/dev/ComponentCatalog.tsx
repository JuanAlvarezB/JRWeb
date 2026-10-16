import { useState, type JSX } from 'react';
import { HeroWash } from '@/presentation/components/brand/HeroWash';
import { SpeedometerArc, type ArcSegment } from '@/presentation/components/brand/SpeedometerArc';
import { Accordion } from '@/presentation/components/ui/Accordion/Accordion';
import { ActionLink } from '@/presentation/components/ui/ActionLink';
import { Button } from '@/presentation/components/ui/Button';
import { Card } from '@/presentation/components/ui/Card';
import { Icon } from '@/presentation/components/ui/Icon';
import { BRAND_ICONS, LINE_ICONS, type IconName } from '@/presentation/components/ui/iconRegistry';
import { Ribbon } from '@/presentation/components/ui/Ribbon';
import { SectionHeading } from '@/presentation/components/ui/SectionHeading';
import { UI_TEXT } from '@/shared/constants/uiText';
import styles from './ComponentCatalog.module.css';

/**
 * Catálogo de componentes (solo DEV, http://localhost:5173). Muestra cada componente
 * con datos de los mockups para compararlo con docs/mockups/ y componentes.pdf.
 * No se incluye en las builds de QA ni de PDN.
 */

const SAMPLE_HOURS: Record<'A2' | 'B1' | 'C1', readonly [number, number, number]> = {
  A2: [25, 3, 15],
  B1: [25, 5, 20],
  C1: [30, 5, 30],
};

function hoursSegments([theory, workshop, driving]: readonly number[]): ArcSegment[] {
  return [
    { id: 'theory', value: theory ?? 0, tone: 'theory' },
    { id: 'workshop', value: workshop ?? 0, tone: 'workshop' },
    { id: 'driving', value: driving ?? 0, tone: 'driving' },
  ];
}

const ALL_ICONS = [...Object.keys(LINE_ICONS), ...Object.keys(BRAND_ICONS)] as IconName[];

export default function ComponentCatalog(): JSX.Element {
  const [category, setCategory] = useState<keyof typeof SAMPLE_HOURS>('B1');
  const hours = SAMPLE_HOURS[category];
  const total = hours.reduce((sum, value) => sum + value, 0);

  return (
    <main className={styles.catalog}>
      <h1>Catálogo de componentes</h1>

      <section className={styles.block} aria-labelledby="cat-buttons">
        <h2 id="cat-buttons">Botones y links</h2>
        <div className={styles.row}>
          <Button href="https://wa.me/573165641048" icon="whatsapp">
            Escríbenos por WhatsApp
          </Button>
          <Button href="#" icon="navigation">
            Cómo llegar
          </Button>
          <Button variant="outline" onClick={() => undefined} icon="mapPin">
            Ver mapa
          </Button>
          <Button to="/planes" variant="outline">
            Ver planes
          </Button>
          <ActionLink to="/planes">Ver planes</ActionLink>
          <ActionLink onClick={() => undefined} icon="copy" arrow={false}>
            Copiar
          </ActionLink>
        </div>
        <div className={styles.row}>
          <Button href="https://wa.me/573165641048" icon="whatsapp" size="large">
            Escríbenos por WhatsApp
          </Button>
          <Button href="https://wa.me/573165641048" icon="whatsapp" fullWidthOnMobile>
            Consultar precio
          </Button>
        </div>
      </section>

      <section className={styles.block} aria-labelledby="cat-ribbon">
        <h2 id="cat-ribbon">Franja firma</h2>
        <div className={styles.column}>
          <Ribbon>{UI_TEXT.brand.tagline}</Ribbon>
          <Ribbon size="large">{UI_TEXT.brand.tagline}</Ribbon>
          <Ribbon size="small">{UI_TEXT.brand.tagline}</Ribbon>
        </div>
      </section>

      <section className={styles.block} aria-labelledby="cat-heading">
        <h2 id="cat-heading">Encabezado de sección</h2>
        <SectionHeading
          eyebrow="Tu curso en horas"
          title="Así se reparten tus horas de clase"
          subtitle="Elige tu categoría y mira cuántas horas son de teoría, de taller y de manejo."
        />
      </section>

      <section className={styles.block} aria-labelledby="cat-cards">
        <h2 id="cat-cards">Tarjetas</h2>
        <ul className={styles.grid} role="list">
          <Card as="li" padding="lg">
            <h3 className={styles.cardTitle}>Instructores certificados</h3>
            <p className={styles.muted}>
              Aprendes con instructores certificados, en teoría, taller y manejo.
            </p>
          </Card>
          <Card as="li" padding="md">
            <h3 className={styles.cardTitle}>Licencia B1</h3>
            <p className={styles.muted}>
              Automóviles, motocarros, cuatrimotos, camperos, camionetas y microbuses de servicio
              particular.
            </p>
          </Card>
          <Card as="li" padding="sm">
            <h3 className={styles.cardTitle}>Correo</h3>
            <p>conducirdelsinu@gmail.com</p>
          </Card>
        </ul>
      </section>

      <section className={styles.block} aria-labelledby="cat-accordion">
        <h2 id="cat-accordion">Acordeón</h2>
        <Accordion defaultOpen={['precio']} className={styles.narrow}>
          <Accordion.Item id="edad">
            <Accordion.Trigger>¿Desde qué edad puedo hacer el curso?</Accordion.Trigger>
            <Accordion.Panel>
              <p>
                A2 y B1 desde los 16 años, para servicio particular. C1 para mayores de 18 años,
                servicio público.
              </p>
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item id="precio">
            <Accordion.Trigger>¿Cuánto cuesta el curso?</Accordion.Trigger>
            <Accordion.Panel>
              <p>Escríbenos por WhatsApp y te enviamos el precio y las promociones vigentes.</p>
              <ActionLink href="https://wa.me/573165641048">Escríbenos por WhatsApp</ActionLink>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </section>

      <section className={styles.block} aria-labelledby="cat-arc">
        <h2 id="cat-arc">Arco del velocímetro</h2>
        <div className={styles.row}>
          {(Object.keys(SAMPLE_HOURS) as (keyof typeof SAMPLE_HOURS)[]).map((key) => (
            <Button
              key={key}
              variant={key === category ? 'primary' : 'outline'}
              onClick={() => {
                setCategory(key);
              }}
            >
              {key}
            </Button>
          ))}
        </div>
        <div className={styles.arcs}>
          <SpeedometerArc
            segments={hoursSegments(hours)}
            centerValue={String(total)}
            caption={UI_TEXT.speedometer.totalCaption}
            needle="end"
            sweep
            label={`Licencia ${category}: ${String(total)} horas en total.`}
            className={styles.arcLarge}
          />
          <SpeedometerArc
            segments={[{ id: 'full', value: 1, tone: 'brand' }]}
            centerValue="0"
            needle="start"
            label="Velocímetro en cero."
            className={styles.arcLarge}
          />
          <Card padding="sm" className={styles.heroCard}>
            <p className={styles.muted}>B1 · 50 horas</p>
            <SpeedometerArc
              segments={hoursSegments(SAMPLE_HOURS.B1)}
              centerValue="50"
              needle="end"
              sweep
              label="Licencia B1: 50 horas."
            />
            <p className={styles.muted}>25 teoría · 5 taller · 20 manejo</p>
          </Card>
        </div>
      </section>

      <section className={styles.block} aria-labelledby="cat-wash">
        <h2 id="cat-wash">Aguada del hero</h2>
        <div className={styles.washStage}>
          <HeroWash />
          <Card padding="sm" className={styles.washCard}>
            <p className={styles.muted}>Licencia B1 · Servicio particular</p>
          </Card>
        </div>
      </section>

      <section className={styles.block} aria-labelledby="cat-icons">
        <h2 id="cat-icons">Íconos</h2>
        <ul className={styles.icons} role="list">
          {ALL_ICONS.map((name) => (
            <li key={name} className={styles.iconItem}>
              <span className={styles.iconCircle}>
                <Icon name={name} className={styles.icon} />
              </span>
              <span className={styles.muted}>{name}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
