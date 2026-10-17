import type { CompanyInfo } from '../../domain/entities/CompanyInfo';
import type { CompanyRepository } from '../../domain/repositories/CompanyRepository';
import { mapCompany } from '../mappers/companyMapper';
import { memoize } from './memoize';

/** Implementación de `CompanyRepository` con el contenido estático del release 1. */
export class StaticCompanyRepository implements CompanyRepository {
  private readonly load: () => CompanyInfo;

  /** @param source - Contenido del JSON (sin validar; se valida al primer uso). */
  constructor(source: unknown) {
    this.load = memoize(() => mapCompany(source));
  }

  get(): Promise<CompanyInfo> {
    return Promise.resolve().then(() => this.load());
  }
}
