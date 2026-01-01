import { ICompanyContactRepository } from 'src/domain/interfaces/repositories/company/ICompanyContactRepository';
import { CompanyContact } from 'src/domain/entities/company-contact.entity';
import { IGetCompanyContactUseCase } from 'src/domain/interfaces/use-cases/company/profile/contacts/IGetCompanyContactUseCase';

export class GetCompanyContactUseCase implements IGetCompanyContactUseCase {
  constructor(private readonly _companyContactRepository: ICompanyContactRepository) {}

  async execute(companyId: string): Promise<CompanyContact[]> {
    const contact = await this._companyContactRepository.findOne({ companyId });
    return contact ? [contact] : [];
  }
}

