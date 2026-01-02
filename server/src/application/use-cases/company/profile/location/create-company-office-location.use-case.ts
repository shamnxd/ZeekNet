import { ICompanyOfficeLocationRepository } from 'src/domain/interfaces/repositories/company/ICompanyOfficeLocationRepository';
import { CompanyOfficeLocation } from 'src/domain/entities/company-office-location.entity';
import { CreateCompanyOfficeLocationRequestDto } from 'src/application/dtos/company/profile/location/requests/company-office-location.dto';
import { ICreateCompanyOfficeLocationUseCase } from 'src/domain/interfaces/use-cases/company/profile/location/ICreateCompanyOfficeLocationUseCase';

export class CreateCompanyOfficeLocationUseCase implements ICreateCompanyOfficeLocationUseCase {
  constructor(private readonly _companyOfficeLocationRepository: ICompanyOfficeLocationRepository) {}

  async execute(data: CreateCompanyOfficeLocationRequestDto): Promise<CompanyOfficeLocation> {
    const { companyId, ...locationData } = data;
    if (!companyId) throw new Error('Company ID is required');
    const officeLocation = CompanyOfficeLocation.create({ ...locationData, companyId });
    return this._companyOfficeLocationRepository.create(officeLocation);
  }
}


