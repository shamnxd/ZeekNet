import { ICompanyVerificationRepository } from '../../../../domain/interfaces/repositories/company/ICompanyVerificationRepository';
import { CompanyVerification } from '../../../../domain/entities/company-profile.entity';
import { CompanyVerificationModel, CompanyVerificationDocument } from '../models/company-verification.model';
import { CompanyProfileModel } from '../models/company-profile.model';
import { CompanyVerificationMapper } from '../mappers/company-verification.mapper';
import { RepositoryBase } from './base-repository';

export class CompanyVerificationRepository extends RepositoryBase<CompanyVerification, CompanyVerificationDocument> implements ICompanyVerificationRepository {
  constructor() {
    super(CompanyVerificationModel);
  }

  protected mapToEntity(doc: CompanyVerificationDocument): CompanyVerification {
    return CompanyVerificationMapper.toEntity(doc as unknown as Parameters<typeof CompanyVerificationMapper.toEntity>[0]);
  }

  protected mapToDocument(entity: Partial<CompanyVerification>): Partial<CompanyVerificationDocument> {
    return CompanyVerificationMapper.toDocument(entity as CompanyVerification);
  }

  async updateVerificationStatus(companyId: string, isVerified: 'pending' | 'rejected' | 'verified', rejectionReason?: string): Promise<void> {
    const updateData: { isVerified: 'pending' | 'rejected' | 'verified'; rejectionReason?: string; updatedAt: Date } = {
      isVerified,
      updatedAt: new Date(),
    };
    
    if (isVerified === 'rejected' && rejectionReason) {
      updateData.rejectionReason = rejectionReason;
    } else if (isVerified !== 'rejected') {
      updateData.rejectionReason = undefined;
    }
    
    await CompanyProfileModel.findByIdAndUpdate(companyId, updateData).exec();
  }

  async getPendingVerifications(): Promise<CompanyVerification[]> {
    const profiles = await CompanyProfileModel.find({ isVerified: 'pending' }).exec();
    const verifications: CompanyVerification[] = [];

    for (const profile of profiles) {
      const verification = await this.findOne({ companyId: String(profile._id) });
      if (verification) {
        verifications.push(verification);
      }
    }

    return verifications;
  }
}