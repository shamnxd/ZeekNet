import { injectable, inject } from 'inversify';
import { TYPES } from 'src/shared/constants/types';
import { ICompanyOfficeLocationRepository } from 'src/domain/interfaces/repositories/company/ICompanyOfficeLocationRepository';
import { CompanyOfficeLocation } from 'src/domain/entities/company-office-location.entity';
import { CreateCompanyOfficeLocationRequestDto } from 'src/application/dtos/company/profile/location/requests/company-office-location.dto';
import { ICreateCompanyOfficeLocationUseCase } from 'src/domain/interfaces/use-cases/company/profile/location/ICreateCompanyOfficeLocationUseCase';
import { IGetCompanyIdByUserIdUseCase } from 'src/domain/interfaces/use-cases/admin/companies/IGetCompanyIdByUserIdUseCase';
import { CompanyLocationResponseDto } from 'src/application/dtos/company/profile/info/responses/company-response.dto';
import { CompanyOfficeLocationMapper } from 'src/application/mappers/company/profile/company-office-location.mapper';

@injectable()
export class CreateCompanyOfficeLocationUseCase implements ICreateCompanyOfficeLocationUseCase {
  constructor(
    @inject(TYPES.CompanyOfficeLocationRepository) private readonly _companyOfficeLocationRepository: ICompanyOfficeLocationRepository,
    @inject(TYPES.GetCompanyIdByUserIdUseCase) private readonly _getCompanyIdByUserIdUseCase: IGetCompanyIdByUserIdUseCase,
  ) {}

  async execute(data: CreateCompanyOfficeLocationRequestDto): Promise<CompanyLocationResponseDto> {
    const companyId = await this._getCompanyIdByUserIdUseCase.execute(data.userId);
    const { userId, ...locationData } = data;
    const officeLocation = CompanyOfficeLocation.create({ ...locationData, companyId });
    const created = await this._companyOfficeLocationRepository.create(officeLocation);
    return CompanyOfficeLocationMapper.toResponse(created);
  }
}
