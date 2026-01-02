import { ICompanyOfficeLocationRepository } from 'src/domain/interfaces/repositories/company/ICompanyOfficeLocationRepository';
import { CompanyOfficeLocation } from 'src/domain/entities/company-office-location.entity';
import { UpdateCompanyOfficeLocationRequestDto } from 'src/application/dtos/company/profile/location/requests/company-office-location.dto';
import { NotFoundError, AuthorizationError } from 'src/domain/errors/errors';
import { IUpdateCompanyOfficeLocationUseCase } from 'src/domain/interfaces/use-cases/company/profile/location/IUpdateCompanyOfficeLocationUseCase';

export class UpdateCompanyOfficeLocationUseCase implements IUpdateCompanyOfficeLocationUseCase {
  constructor(private readonly _companyOfficeLocationRepository: ICompanyOfficeLocationRepository) {}

  async execute(data: UpdateCompanyOfficeLocationRequestDto): Promise<CompanyOfficeLocation> {
    const { companyId, locationId, ...updateData } = data;
    if (!companyId || !locationId) throw new Error('Company ID and Location ID are required');
    const existingLocation = await this._companyOfficeLocationRepository.findById(locationId);
    if (!existingLocation) {
      throw new NotFoundError(`Company office location with ID ${locationId} not found`);
    }
    if (existingLocation.companyId !== companyId) {
      throw new AuthorizationError('Not authorized to update this office location');
    }
    const updatedLocation = await this._companyOfficeLocationRepository.update(locationId, updateData);
    if (!updatedLocation) {
      throw new NotFoundError(`Failed to update company office location with ID ${locationId}`);
    }
    return updatedLocation;
  }
}


