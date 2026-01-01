import { GetCompanyProfileResponseDto } from 'src/application/dtos/company/profile/info/responses/company-profile-response.dto';

export interface GetCompanyDashboardResponseDto {
  hasProfile: boolean;
  profile: GetCompanyProfileResponseDto | null;
  profileStatus: 'not_created' | 'pending' | 'verified' | 'rejected';
}
