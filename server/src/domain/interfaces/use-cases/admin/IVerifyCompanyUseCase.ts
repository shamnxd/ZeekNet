import { CompanyVerificationStatus } from '../../../enums/verification-status.enum';

export interface IVerifyCompanyUseCase {
  execute(companyId: string, isVerified: CompanyVerificationStatus, rejectionReason?: string): Promise<void>;
}
