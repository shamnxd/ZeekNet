import { ICompanyProfileRepository } from '../../../domain/interfaces/repositories/company/ICompanyProfileRepository';
import { ICompanyVerificationRepository } from '../../../domain/interfaces/repositories/company/ICompanyVerificationRepository';
import { IReapplyCompanyVerificationUseCase } from '../../../domain/interfaces/use-cases/ICompanyUseCases';
import { CompanyVerificationData } from 'src/domain/interfaces/use-cases/company/CompanyVerificationData';
import { CompanyProfile } from '../../../domain/entities/company-profile.entity';

export class ReapplyCompanyVerificationUseCase implements IReapplyCompanyVerificationUseCase {
  constructor(
    private readonly _companyProfileRepository: ICompanyProfileRepository,
    private readonly _companyVerificationRepository: ICompanyVerificationRepository,
  ) {}

  async execute(userId: string, verificationData: CompanyVerificationData): Promise<CompanyProfile> {
    const existingProfile = await this._companyProfileRepository.findOne({ userId });
    if (!existingProfile) {
      throw new Error('Company profile not found');
    }

    if (existingProfile.isVerified !== 'rejected') {
      throw new Error('Only rejected companies can reapply for verification');
    }

    if (verificationData.taxId || verificationData.businessLicenseUrl) {
      const verification = await this._companyVerificationRepository.findOne({ companyId: existingProfile.id });
      if (verification) {
        await this._companyVerificationRepository.update(verification.id, {
          taxId: verificationData.taxId,
          businessLicenseUrl: verificationData.businessLicenseUrl,
        });
      }
    }

    await this._companyVerificationRepository.updateVerificationStatus(existingProfile.id, 'pending');

    const updatedProfile = await this._companyProfileRepository.findOne({ userId });
    if (!updatedProfile) {
      throw new Error('Failed to retrieve updated profile');
    }

    return updatedProfile;
  }
}

