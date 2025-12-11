import { CompanyOfficeLocation } from 'src/domain/entities/company-office-location.entity';

export interface IGetCompanyOfficeLocationUseCase {
  execute(companyId: string): Promise<CompanyOfficeLocation[]>;
}
