import type { LegalDocument } from '../entities/LegalDocument';

/** Fuente de los documentos legales. */
export interface LegalDocumentRepository {
  /** @returns La Política de Tratamiento de Datos Personales vigente. */
  getDataPolicy(): Promise<LegalDocument>;
}
