import { GetCompanyProfileResponseDto } from './company-profile-response.dto';

export interface GetCompanyDashboardResponseDto {
  hasProfile: boolean;
  profile: GetCompanyProfileResponseDto | null;
  profileStatus: 'not_created' | 'pending' | 'verified' | 'rejected';
}
