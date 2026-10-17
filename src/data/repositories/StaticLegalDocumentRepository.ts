import type { LegalDocument } from '../../domain/entities/LegalDocument';
import type { LegalDocumentRepository } from '../../domain/repositories/LegalDocumentRepository';
import { mapDataPolicy } from '../mappers/dataPolicyMapper';

/**
 * Implementación de `LegalDocumentRepository` con `legal/data-policy.md`.
 * Recibe una función de carga para que el texto (≈ 58 KB) se descargue solo en la
 * página de la política (import dinámico en el contenedor).
 */
export class StaticLegalDocumentRepository implements LegalDocumentRepository {
  private cached: Promise<LegalDocument> | undefined;

  /** @param loadMarkdown - Devuelve el Markdown de la política. */
  constructor(private readonly loadMarkdown: () => Promise<string>) {}

  getDataPolicy(): Promise<LegalDocument> {
    this.cached ??= this.loadMarkdown().then(mapDataPolicy);
    return this.cached;
  }
}
