import { ICompanyOfficeLocationRepository } from 'src/domain/interfaces/repositories/company/ICompanyOfficeLocationRepository';
import { UpdateCompanyOfficeLocationRequestDto } from 'src/application/dtos/company/profile/location/requests/company-office-location.dto';
import { NotFoundError, AuthorizationError } from 'src/domain/errors/errors';
import { IUpdateCompanyOfficeLocationUseCase } from 'src/domain/interfaces/use-cases/company/profile/location/IUpdateCompanyOfficeLocationUseCase';
import { IGetCompanyIdByUserIdUseCase } from 'src/domain/interfaces/use-cases/admin/companies/IGetCompanyIdByUserIdUseCase';
import { CompanyLocationResponseDto } from 'src/application/dtos/company/profile/info/responses/company-response.dto';
import { CompanyOfficeLocationMapper } from 'src/application/mappers/company/profile/company-office-location.mapper';

export class UpdateCompanyOfficeLocationUseCase implements IUpdateCompanyOfficeLocationUseCase {
  constructor(
    private readonly _companyOfficeLocationRepository: ICompanyOfficeLocationRepository,
    private readonly _getCompanyIdByUserIdUseCase: IGetCompanyIdByUserIdUseCase,
  ) {}

  async execute(data: UpdateCompanyOfficeLocationRequestDto): Promise<CompanyLocationResponseDto> {
    const companyId = await this._getCompanyIdByUserIdUseCase.execute(data.userId);
    const { userId, locationId, ...updateData } = data;
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
    return CompanyOfficeLocationMapper.toResponse(updatedLocation);
  }
}


