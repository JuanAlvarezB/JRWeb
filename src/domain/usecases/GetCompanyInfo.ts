import type { CompanyInfo } from '../entities/CompanyInfo';
import type { CompanyRepository } from '../repositories/CompanyRepository';

/** Obtiene los datos de la empresa (Nosotros, footer y datos estructurados). */
export class GetCompanyInfo {
  constructor(private readonly company: CompanyRepository) {}

  /** @returns La información de la empresa. */
  execute(): Promise<CompanyInfo> {
    return this.company.get();
  }
}
