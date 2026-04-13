import { injectable, inject } from 'inversify';
import { TYPES } from 'src/shared/constants/types';
import { ICompanyOfficeLocationRepository } from 'src/domain/interfaces/repositories/company/ICompanyOfficeLocationRepository';
import { IGetCompanyOfficeLocationUseCase } from 'src/domain/interfaces/use-cases/company/profile/location/IGetCompanyOfficeLocationUseCase';
import { GetCompanyOfficeLocationRequestDto } from 'src/application/dtos/company/profile/location/requests/company-office-location.dto';
import { IGetCompanyIdByUserIdUseCase } from 'src/domain/interfaces/use-cases/admin/companies/IGetCompanyIdByUserIdUseCase';
import { CompanyLocationResponseDto } from 'src/application/dtos/company/profile/info/responses/company-response.dto';
import { CompanyOfficeLocationMapper } from 'src/application/mappers/company/profile/company-office-location.mapper';

@injectable()
export class GetCompanyOfficeLocationUseCase implements IGetCompanyOfficeLocationUseCase {
  constructor(
    @inject(TYPES.CompanyOfficeLocationRepository) private readonly _companyOfficeLocationRepository: ICompanyOfficeLocationRepository,
    @inject(TYPES.GetCompanyIdByUserIdUseCase) private readonly _getCompanyIdByUserIdUseCase: IGetCompanyIdByUserIdUseCase,
  ) {}

  async execute(dto: GetCompanyOfficeLocationRequestDto): Promise<CompanyLocationResponseDto[]> {
    const companyId = await this._getCompanyIdByUserIdUseCase.execute(dto.userId);
    const locations = await this._companyOfficeLocationRepository.findMany({ companyId });
    return CompanyOfficeLocationMapper.toResponseList(locations);
  }
}

