import { CompanyContact } from 'src/domain/entities/company-contact.entity';
import { CompanyContactData } from './CompanyContactData';

// be

export interface ICompanyContactUseCase {
  createContact(data: CompanyContactData): Promise<CompanyContact>;
  getContactsByCompanyId(companyId: string): Promise<CompanyContact[]>;
  updateContact(data: CompanyContactData): Promise<CompanyContact>;
  deleteContact(contactId: string): Promise<void>;
  upsertContact(data: CompanyContactData): Promise<CompanyContact>;
}
