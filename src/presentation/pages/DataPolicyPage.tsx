import type { JSX } from 'react';
import { MarkdownText } from '@/presentation/components/ui/MarkdownText';
import { formatLegalHeading } from '@/presentation/formatters/legal';
import { formatLongDate } from '@/presentation/formatters/text';
import { useCompanyInfo } from '@/presentation/hooks/useCompanyInfo';
import { useDataPolicy } from '@/presentation/hooks/useDataPolicy';
import { UI_TEXT } from '@/shared/constants/uiText';
import styles from './DataPolicyPage.module.css';

const TEXT = UI_TEXT.pages.dataPolicy;

/**
 * Política de Tratamiento de Datos (DESIGN.md §8): índice lateral (arriba en móvil) y
 * columna de lectura de 720 px con el texto oficial, sección por sección. El texto se
 * descarga solo al abrir esta página.
 */
export default function DataPolicyPage(): JSX.Element {
  const policy = useDataPolicy();
  const { brandName, nit } = useCompanyInfo();

  return (
    <>
      <title>{UI_TEXT.pages.documentTitle(TEXT.title)}</title>
      <header className={styles.header}>
        <h1 className={styles.title}>{TEXT.title}</h1>
        <p className={styles.meta}>
          {TEXT.subtitle(brandName, nit)}
          <br />
          {TEXT.effective(formatLongDate(policy.effectiveDate))}
        </p>
      </header>

      <div className={styles.layout}>
        <nav aria-labelledby="politica-indice" className={styles.index}>
          <h2 id="politica-indice" className={styles.indexTitle}>
            {TEXT.index}
          </h2>
          <ol className={styles.indexList}>
            {policy.sections.map((section) => (
              <li key={section.id}>
                <a href={`#${section.id}`} className={styles.indexLink}>
                  {formatLegalHeading(section.title)}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <article aria-labelledby="politica-titulo" className={styles.document}>
          <h2 id="politica-titulo" className={styles.documentTitle}>
            {policy.title}
          </h2>
          {policy.sections.map((section) => (
            <section key={section.id} id={section.id} aria-labelledby={`${section.id}-titulo`}>
              <h3 id={`${section.id}-titulo`} className={styles.sectionTitle}>
                {formatLegalHeading(section.title)}
              </h3>
              <MarkdownText markdown={section.body} />
            </section>
          ))}
        </article>
      </div>
    </>
  );
}
