import { IGetCompanyProfileUseCase, IGetCompanyDashboardUseCase } from '../../../domain/interfaces/use-cases/ICompanyUseCases';

export class GetCompanyDashboardUseCase implements IGetCompanyDashboardUseCase {
  constructor(private readonly _getCompanyProfileUseCase: IGetCompanyProfileUseCase) {}

  async execute(userId: string) {
    const companyProfile = await this._getCompanyProfileUseCase.execute(userId);

    // Business logic: Determine profile status
    const profileStatus: 'not_created' | 'pending' | 'verified' | 'rejected' = companyProfile
      ? (companyProfile.profile.isVerified || 'not_created')
      : 'not_created';

    return {
      hasProfile: !!companyProfile,
      profile: companyProfile,
      profileStatus,
    };
  }
}

