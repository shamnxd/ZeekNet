import { CompanyVerification } from '../../../entities/company-verification.entity';
import { IBaseRepository } from '../IBaseRepository';

export interface ICompanyVerificationRepository extends IBaseRepository<CompanyVerification> {
  // Complex query that requires specific business logic
  getPendingVerifications(): Promise<CompanyVerification[]>;
  
  // Special method that updates CompanyProfile model (cross-model operation)
  updateVerificationStatus(companyId: string, isVerified: 'pending' | 'rejected' | 'verified', rejectionReason?: string): Promise<void>;
}