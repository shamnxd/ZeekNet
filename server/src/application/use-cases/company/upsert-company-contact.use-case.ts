import { ICompanyContactRepository } from '../../../domain/interfaces/repositories/company/ICompanyContactRepository';
import { CompanyContact } from '../../../domain/entities/company-contact.entity';
import { UpdateCompanyContactDto } from '../../dto/company/company-contact.dto';
import { IUpsertCompanyContactUseCase } from '../../../domain/interfaces/use-cases/company/IUpsertCompanyContactUseCase';

export class UpsertCompanyContactUseCase implements IUpsertCompanyContactUseCase {
  constructor(private readonly _companyContactRepository: ICompanyContactRepository) {}

  async execute(data: UpdateCompanyContactDto & { companyId?: string }): Promise<CompanyContact> {
    const { companyId, ...contactData } = data;
    if (!companyId) throw new Error('Company ID is required');
    const existingContact = await this._companyContactRepository.findOne({ companyId });
    if (existingContact) {
      const updated = await this._companyContactRepository.update(existingContact.id, contactData);
      if (!updated) throw new Error('Contact not found');
      return updated;
    }
    const contact = CompanyContact.create({
      companyId,
      ...contactData,
    });
    return this._companyContactRepository.create(contact);
  }
}

