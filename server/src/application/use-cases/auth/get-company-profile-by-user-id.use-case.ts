import { ICompanyProfileRepository } from '../../../domain/interfaces/repositories/company/ICompanyProfileRepository';
import { CompanyProfile } from '../../../domain/entities/company-profile.entity';
import { AppError } from '../../../domain/errors/errors';
import { IGetCompanyProfileByUserIdUseCase } from '../../../domain/interfaces/use-cases/ICompanyUseCases';

export class GetCompanyProfileByUserIdUseCase implements IGetCompanyProfileByUserIdUseCase {
  constructor(private readonly _companyProfileRepository: ICompanyProfileRepository) {}

  async execute(userId: string): Promise<CompanyProfile | null> {
    if (!userId) {
      throw new AppError('User ID is required', 400);
    }

    const companyProfile = await this._companyProfileRepository.findOne({ userId });
    return companyProfile;
  }
}
