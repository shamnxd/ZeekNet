import { CompanyContact } from 'src/domain/entities/company-contact.entity';

export interface IGetCompanyContactUseCase {
  execute(companyId: string): Promise<CompanyContact[]>;
}

