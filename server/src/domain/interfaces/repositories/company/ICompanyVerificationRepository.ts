import { CompanyVerification } from 'src/domain/entities/company-verification.entity';
import { IBaseRepository } from 'src/domain/interfaces/repositories/base/IBaseRepository';

export interface ICompanyVerificationRepository extends IBaseRepository<CompanyVerification> {
  getPendingVerifications(): Promise<CompanyVerification[]>;
  updateVerificationStatus(companyId: string, isVerified: 'pending' | 'rejected' | 'verified', rejectionReason?: string): Promise<void>;
}
