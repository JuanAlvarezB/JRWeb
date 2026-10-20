import { createCompanyInfo, type CompanyInfo } from '../../domain/entities/CompanyInfo';
import { companySchema } from '../schemas/companySchema';
import { parseContent } from '../schemas/parseContent';

/** `company.json` → `CompanyInfo` validada (esquema + reglas del dominio). */
export function mapCompany(raw: unknown): CompanyInfo {
  return createCompanyInfo(parseContent(companySchema, raw, 'company.json'));
}
