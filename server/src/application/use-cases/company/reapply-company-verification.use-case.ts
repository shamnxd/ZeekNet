import { ICompanyProfileRepository } from '../../../domain/interfaces/repositories/company/ICompanyProfileRepository';
import { ICompanyVerificationRepository } from '../../../domain/interfaces/repositories/company/ICompanyVerificationRepository';
import { IReapplyCompanyVerificationUseCase } from '../../../domain/interfaces/use-cases/company/IReapplyCompanyVerificationUseCase';
import { CompanyVerificationRequestDtoType } from '../../dto/company/company-verification-request.dto';
import { CompanyProfile } from '../../../domain/entities/company-profile.entity';
import { CompanyVerificationStatus } from '../../../domain/enums/verification-status.enum';

export class ReapplyCompanyVerificationUseCase implements IReapplyCompanyVerificationUseCase {
  constructor(
    private readonly _companyProfileRepository: ICompanyProfileRepository,
    private readonly _companyVerificationRepository: ICompanyVerificationRepository,
  ) {}

  async execute(data: CompanyVerificationRequestDtoType): Promise<CompanyProfile> {
    const { userId, ...verificationData } = data;
    if (!userId) throw new Error('User ID is required');
    const existingProfile = await this._companyProfileRepository.findOne({ userId });
    if (!existingProfile) {
      throw new Error('Company profile not found');
    }

    if (existingProfile.isVerified !== CompanyVerificationStatus.REJECTED) {
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

    await this._companyVerificationRepository.updateVerificationStatus(existingProfile.id, CompanyVerificationStatus.PENDING);

    const updatedProfile = await this._companyProfileRepository.findOne({ userId });
    if (!updatedProfile) {
      throw new Error('Failed to retrieve updated profile');
    }

    return updatedProfile;
  }
}

