import { CompanyProfileResponseDto } from 'src/application/dtos/company/profile/info/responses/company-response.dto';

export interface IGetCompanyProfileByUserIdUseCase {
  execute(userId: string): Promise<CompanyProfileResponseDto | null>;
}
