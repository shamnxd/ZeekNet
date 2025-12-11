import { ICompanyContactRepository } from '../../../domain/interfaces/repositories/company/ICompanyContactRepository';
import { CompanyContact } from '../../../domain/entities/company-contact.entity';
import { IGetCompanyContactUseCase } from '../../../domain/interfaces/use-cases/company/IGetCompanyContactUseCase';

export class GetCompanyContactUseCase implements IGetCompanyContactUseCase {
  constructor(private readonly _companyContactRepository: ICompanyContactRepository) {}

  async execute(companyId: string): Promise<CompanyContact[]> {
    const contact = await this._companyContactRepository.findOne({ companyId });
    return contact ? [contact] : [];
  }
}

