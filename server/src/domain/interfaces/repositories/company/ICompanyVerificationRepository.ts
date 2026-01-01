import { CompanyVerification } from '../../../entities/company-verification.entity';
import { IBaseRepository } from '../IBaseRepository';

export interface ICompanyVerificationRepository extends IBaseRepository<CompanyVerification> {
  getPendingVerifications(): Promise<CompanyVerification[]>;
  updateVerificationStatus(companyId: string, isVerified: 'pending' | 'rejected' | 'verified', rejectionReason?: string): Promise<void>;
}
