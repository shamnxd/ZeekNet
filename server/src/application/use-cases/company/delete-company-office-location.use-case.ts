import { ICompanyOfficeLocationRepository } from '../../../domain/interfaces/repositories/company/ICompanyOfficeLocationRepository';
import { NotFoundError, AuthorizationError } from '../../../domain/errors/errors';
import { IDeleteCompanyOfficeLocationUseCase } from '../../../domain/interfaces/use-cases/ICompanyUseCases';

export class DeleteCompanyOfficeLocationUseCase implements IDeleteCompanyOfficeLocationUseCase {
  constructor(private readonly _companyOfficeLocationRepository: ICompanyOfficeLocationRepository) {}

  async execute(companyId: string, locationId: string): Promise<void> {
    const existingLocation = await this._companyOfficeLocationRepository.findById(locationId);
    if (!existingLocation) {
      throw new NotFoundError(`Company office location with ID ${locationId} not found`);
    }
    if (existingLocation.companyId !== companyId) {
      throw new AuthorizationError('Not authorized to delete this office location');
    }
    await this._companyOfficeLocationRepository.delete(locationId);
  }
}

