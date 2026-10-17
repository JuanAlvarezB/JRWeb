import type { CompanyInfo } from '../entities/CompanyInfo';

/** Fuente de los datos de la empresa (misión, visión, NIT, diferenciadores). */
export interface CompanyRepository {
  /** @returns La información validada de la empresa. */
  get(): Promise<CompanyInfo>;
}
