import { CompanyLocationResponseDto } from 'src/application/dtos/company/profile/info/responses/company-response.dto';
import { GetCompanyOfficeLocationRequestDto } from 'src/application/dtos/company/profile/location/requests/company-office-location.dto';

export interface IGetCompanyOfficeLocationUseCase {
  execute(dto: GetCompanyOfficeLocationRequestDto): Promise<CompanyLocationResponseDto[]>;
}
