import { ICompanyVerificationRepository } from '../../../domain/interfaces/repositories/company/ICompanyVerificationRepository';
import { IVerifyCompanyUseCase } from '../../../domain/interfaces/use-cases/IAdminUseCases';

export class VerifyCompanyUseCase implements IVerifyCompanyUseCase {
  constructor(private readonly _companyVerificationRepository: ICompanyVerificationRepository) {}

  async execute(companyId: string, isVerified: 'pending' | 'rejected' | 'verified', rejectionReason?: string): Promise<void> {
    await this._companyVerificationRepository.updateVerificationStatus(companyId, isVerified, rejectionReason);
  }
}
