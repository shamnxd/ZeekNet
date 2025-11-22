import { IGetCompanyProfileUseCase } from '../../../domain/interfaces/use-cases/ICompanyUseCases';
import { AppError } from '../../../domain/errors/errors';

export class GetCompanyIdByUserIdUseCase {
  constructor(private readonly _getCompanyProfileUseCase: IGetCompanyProfileUseCase) {}

  async execute(userId: string): Promise<string> {
    const companyProfile = await this._getCompanyProfileUseCase.execute(userId);
    
    if (!companyProfile) {
      throw new AppError('Company profile not found', 404);
    }

    return companyProfile.profile.id;
  }
}
