import { CompanyContact } from 'src/domain/entities/company-contact.entity';
import { IBaseRepository } from 'src/domain/interfaces/repositories/base/IBaseRepository';

export interface ICompanyContactRepository extends IBaseRepository<CompanyContact> {
}
