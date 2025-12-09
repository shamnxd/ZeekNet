import { ICompanyOfficeLocationRepository } from '../../../domain/interfaces/repositories/company/ICompanyOfficeLocationRepository';
import { CompanyOfficeLocation } from '../../../domain/entities/company-office-location.entity';
import { CreateCompanyOfficeLocationRequestDto } from '../../dto/company/company-office-location.dto';
import { ICreateCompanyOfficeLocationUseCase } from '../../../domain/interfaces/use-cases/ICompanyUseCases';

export class CreateCompanyOfficeLocationUseCase implements ICreateCompanyOfficeLocationUseCase {
  constructor(private readonly _companyOfficeLocationRepository: ICompanyOfficeLocationRepository) {}

  async execute(data: CompanyOfficeLocationData): Promise<CompanyOfficeLocation> {
    const { companyId, ...locationData } = data;
    if (!companyId) throw new Error('Company ID is required');
    const officeLocation = CompanyOfficeLocation.create({ ...locationData, companyId });
    return this._companyOfficeLocationRepository.create(officeLocation);
  }
}

