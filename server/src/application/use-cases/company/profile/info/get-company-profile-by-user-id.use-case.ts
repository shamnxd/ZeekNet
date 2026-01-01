import { ICompanyProfileRepository } from 'src/domain/interfaces/repositories/company/ICompanyProfileRepository';
import { CompanyProfile } from 'src/domain/entities/company-profile.entity';
import { BadRequestError } from 'src/domain/errors/errors';
import { IGetCompanyProfileByUserIdUseCase } from 'src/domain/interfaces/use-cases/company/profile/info/IGetCompanyProfileByUserIdUseCase';

export class GetCompanyProfileByUserIdUseCase implements IGetCompanyProfileByUserIdUseCase {
  constructor(private readonly _companyProfileRepository: ICompanyProfileRepository) {}

  async execute(userId: string): Promise<CompanyProfile | null> {
    if (!userId) {
      throw new BadRequestError('User ID is required');
    }

    const companyProfile = await this._companyProfileRepository.findOne({ userId });
    return companyProfile;
  }
}
