import { IGetCompanyProfileUseCase } from '../../../domain/interfaces/use-cases/company/IGetCompanyProfileUseCase';
import { IGetCompanyIdByUserIdUseCase } from '../../../domain/interfaces/use-cases/company/IGetCompanyIdByUserIdUseCase';
import { AppError } from '../../../domain/errors/errors';

export class GetCompanyIdByUserIdUseCase implements IGetCompanyIdByUserIdUseCase {
  constructor(private readonly _getCompanyProfileUseCase: IGetCompanyProfileUseCase) {}

  async execute(userId: string): Promise<string> {
    const companyProfile = await this._getCompanyProfileUseCase.execute(userId);
    
    if (!companyProfile) {
      throw new AppError('Company profile not found', 404);
    }

    return companyProfile.profile.id;
  }
}
