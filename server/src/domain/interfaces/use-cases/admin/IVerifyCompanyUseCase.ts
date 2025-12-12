export interface IVerifyCompanyUseCase {
  execute(companyId: string, isVerified: 'pending' | 'rejected' | 'verified', rejectionReason?: string): Promise<void>;
}
