import { ICompanyProfileRepository } from '../../../domain/interfaces/repositories/company/ICompanyProfileRepository';
import { CompanyProfile } from '../../../domain/entities/company-profile.entity';
import { AppError } from '../../../domain/errors/errors';

export class GetCompanyProfileByUserIdUseCase {
  constructor(private readonly _companyProfileRepository: ICompanyProfileRepository) {}

  async execute(userId: string): Promise<CompanyProfile | null> {
    try {
      if (!userId) {
        throw new AppError('User ID is required', 400);
      }

      const companyProfile = await this._companyProfileRepository.findOne({ userId });
      return companyProfile;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to get company profile by user ID', 500);
    }
  }
}
