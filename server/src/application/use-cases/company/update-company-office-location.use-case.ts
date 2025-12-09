import { ICompanyOfficeLocationRepository } from '../../../domain/interfaces/repositories/company/ICompanyOfficeLocationRepository';
import { CompanyOfficeLocation } from '../../../domain/entities/company-office-location.entity';
import { CompanyOfficeLocationData } from '../../../domain/interfaces/use-cases/company/CompanyOfficeLocationData';
import { NotFoundError, AuthorizationError } from '../../../domain/errors/errors';
import { IUpdateCompanyOfficeLocationUseCase } from '../../../domain/interfaces/use-cases/ICompanyUseCases';

export class UpdateCompanyOfficeLocationUseCase implements IUpdateCompanyOfficeLocationUseCase {
  constructor(private readonly _companyOfficeLocationRepository: ICompanyOfficeLocationRepository) {}

  async execute(data: CompanyOfficeLocationData): Promise<CompanyOfficeLocation> {
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

