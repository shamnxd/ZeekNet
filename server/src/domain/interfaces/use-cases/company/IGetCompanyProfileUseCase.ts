import { GetCompanyProfileResponseDto } from 'src/application/dto/company/company-profile-response.dto';



export interface IGetCompanyProfileUseCase {
  execute(userId: string): Promise<GetCompanyProfileResponseDto | null>;
}
