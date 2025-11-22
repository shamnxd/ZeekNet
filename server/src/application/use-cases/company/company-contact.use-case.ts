import { ICompanyContactRepository } from '../../../domain/interfaces/repositories/company/ICompanyContactRepository';
import { CompanyContact } from '../../../domain/entities/company-contact.entity';
import { ICompanyContactUseCase, CompanyContactData } from '../../../domain/interfaces/use-cases/ICompanyUseCases';

export class CompanyContactUseCase implements ICompanyContactUseCase {
  constructor(private readonly _companyContactRepository: ICompanyContactRepository) {}

  async createContact(companyId: string, data: CompanyContactData): Promise<CompanyContact> {
    const contact = CompanyContact.create({
      companyId,
      ...data,
    });
    return this._companyContactRepository.create(contact);
  }

  async getContactsByCompanyId(companyId: string): Promise<CompanyContact[]> {
    const contact = await this._companyContactRepository.findOne({ companyId });
    return contact ? [contact] : [];
  }

  async updateContact(contactId: string, data: CompanyContactData): Promise<CompanyContact> {
    const updated = await this._companyContactRepository.update(contactId, data);
    if (!updated) throw new Error('Contact not found');
    return updated;
  }

  async deleteContact(contactId: string): Promise<void> {
    const deleted = await this._companyContactRepository.delete(contactId);
    if (!deleted) throw new Error('Contact not found');
  }
}

