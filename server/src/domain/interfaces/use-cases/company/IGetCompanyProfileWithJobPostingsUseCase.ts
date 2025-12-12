import { CompanyProfileWithDetailsResponseDto } from 'src/application/dto/company/company-response.dto';


export interface IGetCompanyProfileWithJobPostingsUseCase {
  execute(userId: string): Promise<CompanyProfileWithDetailsResponseDto>;
}
