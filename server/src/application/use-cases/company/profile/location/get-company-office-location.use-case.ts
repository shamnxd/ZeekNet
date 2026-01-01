import { ICompanyOfficeLocationRepository } from 'src/domain/interfaces/repositories/company/ICompanyOfficeLocationRepository';
import { CompanyOfficeLocation } from 'src/domain/entities/company-office-location.entity';
import { IGetCompanyOfficeLocationUseCase } from 'src/domain/interfaces/use-cases/company/profile/location/IGetCompanyOfficeLocationUseCase';

export class GetCompanyOfficeLocationUseCase implements IGetCompanyOfficeLocationUseCase {
  constructor(private readonly _companyOfficeLocationRepository: ICompanyOfficeLocationRepository) {}

  async execute(companyId: string): Promise<CompanyOfficeLocation[]> {
    return this._companyOfficeLocationRepository.findMany({ companyId });
  }
}

