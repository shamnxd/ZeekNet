import { IGetCompanyProfileUseCase } from '../../../domain/interfaces/use-cases/company/IGetCompanyProfileUseCase';
import { IGetCompanyIdByUserIdUseCase } from '../../../domain/interfaces/use-cases/company/IGetCompanyIdByUserIdUseCase';
import { NotFoundError } from '../../../domain/errors/errors';

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
