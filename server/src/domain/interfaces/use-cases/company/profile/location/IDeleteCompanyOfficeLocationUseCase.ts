import { DeleteCompanyOfficeLocationRequestDto } from 'src/application/dtos/company/profile/location/requests/company-office-location.dto';

export interface IDeleteCompanyOfficeLocationUseCase {
  execute(dto: DeleteCompanyOfficeLocationRequestDto): Promise<void>;
}
