import { CompanyContact } from '../../../entities/company-contact.entity';
import { IBaseRepository } from '../IBaseRepository';

export interface ICompanyContactRepository extends IBaseRepository<CompanyContact> {
  // Use findOne({ companyId }) and exists({ companyId }) from base instead
}