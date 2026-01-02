import { GetCompanyProfileResponseDto } from 'src/application/dtos/company/profile/info/responses/company-profile-response.dto';



export interface IGetCompanyProfileUseCase {
  execute(userId: string): Promise<GetCompanyProfileResponseDto | null>;
}

