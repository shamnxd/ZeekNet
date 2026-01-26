import { ICompanyOfficeLocationRepository } from 'src/domain/interfaces/repositories/company/ICompanyOfficeLocationRepository';
import { NotFoundError, AuthorizationError } from 'src/domain/errors/errors';
import { IDeleteCompanyOfficeLocationUseCase } from 'src/domain/interfaces/use-cases/company/profile/location/IDeleteCompanyOfficeLocationUseCase';
import { DeleteCompanyOfficeLocationRequestDto } from 'src/application/dtos/company/profile/location/requests/company-office-location.dto';
import { IGetCompanyIdByUserIdUseCase } from 'src/domain/interfaces/use-cases/admin/companies/IGetCompanyIdByUserIdUseCase';

export class DeleteCompanyOfficeLocationUseCase implements IDeleteCompanyOfficeLocationUseCase {
  constructor(
    private readonly _companyOfficeLocationRepository: ICompanyOfficeLocationRepository,
    private readonly _getCompanyIdByUserIdUseCase: IGetCompanyIdByUserIdUseCase,
  ) {}

  async execute(dto: DeleteCompanyOfficeLocationRequestDto): Promise<void> {
    const companyId = await this._getCompanyIdByUserIdUseCase.execute(dto.userId);
    const existingLocation = await this._companyOfficeLocationRepository.findById(dto.locationId);
    if (!existingLocation) {
      throw new NotFoundError(`Company office location with ID ${dto.locationId} not found`);
    }
    if (existingLocation.companyId !== companyId) {
      throw new AuthorizationError('Not authorized to delete this office location');
    }
    await this._companyOfficeLocationRepository.delete(dto.locationId);
  }
}

