import { CreateCompanyOfficeLocationRequestDto } from 'src/application/dtos/company/profile/location/requests/company-office-location.dto';
import { CompanyLocationResponseDto } from 'src/application/dtos/company/profile/info/responses/company-response.dto';

export interface ICreateCompanyOfficeLocationUseCase {
  execute(data: CreateCompanyOfficeLocationRequestDto): Promise<CompanyLocationResponseDto>;
}

