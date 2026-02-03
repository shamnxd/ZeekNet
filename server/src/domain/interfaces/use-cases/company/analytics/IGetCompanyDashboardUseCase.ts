import { CompanyProfileWithDetailsResponseDto } from 'src/application/dtos/company/profile/info/responses/company-response.dto';

export interface IGetCompanyDashboardUseCase {
  execute(userId: string): Promise<{
    hasProfile: boolean;
    profile: CompanyProfileWithDetailsResponseDto | null;
    profileStatus: 'not_created' | 'pending' | 'verified' | 'rejected';
  }>;
}
