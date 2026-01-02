import { CompanyProfileWithDetailsResponseDto } from 'src/application/dtos/company/profile/info/responses/company-response.dto';


export interface IGetCompanyProfileWithJobPostingsUseCase {
  execute(userId: string): Promise<CompanyProfileWithDetailsResponseDto>;
}

