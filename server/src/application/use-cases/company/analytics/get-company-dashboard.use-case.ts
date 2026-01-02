import { IGetCompanyDashboardUseCase } from 'src/domain/interfaces/use-cases/company/analytics/IGetCompanyDashboardUseCase';
import { IGetCompanyProfileUseCase } from 'src/domain/interfaces/use-cases/company/profile/info/IGetCompanyProfileUseCase';

export class GetCompanyDashboardUseCase implements IGetCompanyDashboardUseCase {
  constructor(private readonly _getCompanyProfileUseCase: IGetCompanyProfileUseCase) {}

  async execute(userId: string) {
    const companyProfile = await this._getCompanyProfileUseCase.execute(userId);

    const profileStatus: 'not_created' | 'pending' | 'verified' | 'rejected' = companyProfile
      ? (companyProfile.profile.is_verified || 'not_created')
      : 'not_created';

    return {
      hasProfile: !!companyProfile,
      profile: companyProfile,
      profileStatus,
    };
  }
}

