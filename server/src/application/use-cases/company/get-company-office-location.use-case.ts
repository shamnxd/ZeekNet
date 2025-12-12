import { ICompanyOfficeLocationRepository } from '../../../domain/interfaces/repositories/company/ICompanyOfficeLocationRepository';
import { CompanyOfficeLocation } from '../../../domain/entities/company-office-location.entity';
import { IGetCompanyOfficeLocationUseCase } from '../../../domain/interfaces/use-cases/company/IGetCompanyOfficeLocationUseCase';

export class GetCompanyOfficeLocationUseCase implements IGetCompanyOfficeLocationUseCase {
  constructor(private readonly _companyOfficeLocationRepository: ICompanyOfficeLocationRepository) {}

  async execute(companyId: string): Promise<CompanyOfficeLocation[]> {
    return this._companyOfficeLocationRepository.findMany({ companyId });
  }
}

