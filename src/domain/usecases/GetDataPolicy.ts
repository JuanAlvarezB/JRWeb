import type { LegalDocument } from '../entities/LegalDocument';
import type { LegalDocumentRepository } from '../repositories/LegalDocumentRepository';

/** Obtiene la Política de Tratamiento de Datos Personales con sus secciones. */
export class GetDataPolicy {
  constructor(private readonly documents: LegalDocumentRepository) {}

  /** @returns La política vigente (las secciones generan el índice de la página). */
  execute(): Promise<LegalDocument> {
    return this.documents.getDataPolicy();
  }
}
