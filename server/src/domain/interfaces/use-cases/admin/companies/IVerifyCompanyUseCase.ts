import { CompanyVerificationStatus } from 'src/domain/enums/verification-status.enum';

export interface IVerifyCompanyUseCase {
  execute(companyId: string, isVerified: CompanyVerificationStatus, rejectionReason?: string): Promise<void>;
}
