import { ICompanyOfficeLocationRepository } from '../../../domain/interfaces/repositories/company/ICompanyOfficeLocationRepository';
import { NotFoundError } from '../../../domain/errors/errors';
import { IDeleteCompanyOfficeLocationUseCase } from '../../../domain/interfaces/use-cases/ICompanyUseCases';

export class DeleteCompanyOfficeLocationUseCase implements IDeleteCompanyOfficeLocationUseCase {
  constructor(private readonly _companyOfficeLocationRepository: ICompanyOfficeLocationRepository) {}

  async execute(locationId: string): Promise<void> {
    const existingLocation = await this._companyOfficeLocationRepository.findById(locationId);
    if (!existingLocation) {
      throw new NotFoundError(`Company office location with ID ${locationId} not found`);
    }
    await this._companyOfficeLocationRepository.delete(locationId);
  }
}

