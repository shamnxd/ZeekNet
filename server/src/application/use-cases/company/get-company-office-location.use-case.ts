import { ICompanyOfficeLocationRepository } from '../../../domain/interfaces/repositories/company/ICompanyOfficeLocationRepository';
import { CompanyOfficeLocation } from '../../../domain/entities/company-office-location.entity';
import { IGetCompanyOfficeLocationUseCase } from '../../../domain/interfaces/use-cases/ICompanyUseCases';

export class GetCompanyOfficeLocationUseCase implements IGetCompanyOfficeLocationUseCase {
  constructor(private readonly _companyOfficeLocationRepository: ICompanyOfficeLocationRepository) {}

  async executeByCompanyId(companyId: string): Promise<CompanyOfficeLocation[]> {
    return this._companyOfficeLocationRepository.findMany({ companyId });
  }

  async executeById(locationId: string): Promise<CompanyOfficeLocation | null> {
    return this._companyOfficeLocationRepository.findById(locationId);
  }
}

