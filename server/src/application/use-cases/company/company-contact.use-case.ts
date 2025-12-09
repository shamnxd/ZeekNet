import { ICompanyContactRepository } from '../../../domain/interfaces/repositories/company/ICompanyContactRepository';
import { CompanyContact } from '../../../domain/entities/company-contact.entity';
import { CompanyContactData } from '../../../domain/interfaces/use-cases/company/CompanyContactData';
import { ICompanyContactUseCase } from '../../../domain/interfaces/use-cases/company/ICompanyContactUseCase';

export class CompanyContactUseCase implements ICompanyContactUseCase {
  constructor(private readonly _companyContactRepository: ICompanyContactRepository) {}

  async createContact(data: CompanyContactData): Promise<CompanyContact> {
    const { companyId, ...contactData } = data;
    if (!companyId) throw new Error('Company ID is required');
    const contact = CompanyContact.create({
      companyId,
      ...contactData,
    });
    return this._companyContactRepository.create(contact);
  }

  async getContactsByCompanyId(companyId: string): Promise<CompanyContact[]> {
    const contact = await this._companyContactRepository.findOne({ companyId });
    return contact ? [contact] : [];
  }

  async updateContact(data: CompanyContactData): Promise<CompanyContact> {
    const { contactId, ...contactData } = data;
    if (!contactId) throw new Error('Contact ID is required');
    const updated = await this._companyContactRepository.update(contactId, contactData);
    if (!updated) throw new Error('Contact not found');
    return updated;
  }

  async deleteContact(contactId: string): Promise<void> {
    const deleted = await this._companyContactRepository.delete(contactId);
    if (!deleted) throw new Error('Contact not found');
  }

  async upsertContact(data: CompanyContactData): Promise<CompanyContact> {
    const { companyId, ...contactData } = data;
    if (!companyId) throw new Error('Company ID is required');
    const existingContact = await this._companyContactRepository.findOne({ companyId });
    if (existingContact) {
      return this.updateContact({ ...contactData, contactId: existingContact.id });
    }
    return this.createContact({ ...contactData, companyId });
  }
}

