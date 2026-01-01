import { GetCompanyProfileResponseDto } from 'src/application/dtos/company/responses/company-profile-response.dto';



export interface IGetCompanyProfileUseCase {
  execute(userId: string): Promise<GetCompanyProfileResponseDto | null>;
}

