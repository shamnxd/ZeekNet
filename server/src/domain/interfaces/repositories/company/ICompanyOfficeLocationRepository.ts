import { CompanyOfficeLocation } from '../../../entities/company-office-location.entity';
import { IBaseRepository } from '../IBaseRepository';

export interface ICompanyOfficeLocationRepository extends IBaseRepository<CompanyOfficeLocation> {
  // Use findMany({ companyId }) from base instead
}