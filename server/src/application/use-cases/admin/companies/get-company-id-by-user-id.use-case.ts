import { IGetCompanyProfileUseCase } from 'src/domain/interfaces/use-cases/company/profile/info/IGetCompanyProfileUseCase';
import { IGetCompanyIdByUserIdUseCase } from 'src/domain/interfaces/use-cases/admin/companies/IGetCompanyIdByUserIdUseCase';
import { NotFoundError } from 'src/domain/errors/errors';

export class GetCompanyIdByUserIdUseCase implements IGetCompanyIdByUserIdUseCase {
  constructor(private readonly _getCompanyProfileUseCase: IGetCompanyProfileUseCase) {}

  async execute(userId: string): Promise<string> {
    const companyProfile = await this._getCompanyProfileUseCase.execute(userId);
    
    if (!companyProfile) {
      throw new NotFoundError('Company profile not found');
    }

    return companyProfile.profile.id;
  }
}
