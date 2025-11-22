import { ICompanyOfficeLocationRepository } from '../../../domain/interfaces/repositories/company/ICompanyOfficeLocationRepository';
import { CompanyOfficeLocation } from '../../../domain/entities/company-office-location.entity';
import { UpdateCompanyOfficeLocationRequestDto } from '../../dto/company/company-office-location.dto';
import { NotFoundError } from '../../../domain/errors/errors';
import { IUpdateCompanyOfficeLocationUseCase } from '../../../domain/interfaces/use-cases/ICompanyUseCases';

export class UpdateCompanyOfficeLocationUseCase implements IUpdateCompanyOfficeLocationUseCase {
  constructor(private readonly _companyOfficeLocationRepository: ICompanyOfficeLocationRepository) {}

  async execute(locationId: string, data: UpdateCompanyOfficeLocationRequestDto): Promise<CompanyOfficeLocation> {
    const existingLocation = await this._companyOfficeLocationRepository.findById(locationId);
    if (!existingLocation) {
      throw new NotFoundError(`Company office location with ID ${locationId} not found`);
    }
    const updatedLocation = await this._companyOfficeLocationRepository.update(locationId, data);
    if (!updatedLocation) {
      throw new NotFoundError(`Failed to update company office location with ID ${locationId}`);
    }
    return updatedLocation;
  }
}

