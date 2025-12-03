import { ICompanySubscriptionRepository } from '../../../domain/interfaces/repositories/subscription/ICompanySubscriptionRepository';
import { ICompanyProfileRepository } from '../../../domain/interfaces/repositories/company/ICompanyProfileRepository';
import { CompanySubscription } from '../../../domain/entities/company-subscription.entity';
import { AppError } from '../../../domain/errors/errors';

export class GetActiveSubscriptionUseCase {
  constructor(
    private _companySubscriptionRepository: ICompanySubscriptionRepository,
    private _companyProfileRepository: ICompanyProfileRepository,
  ) {}

  async execute(userId: string): Promise<CompanySubscription | null> {
    const companyProfile = await this._companyProfileRepository.findOne({ userId });
    
    if (!companyProfile) {
      throw new AppError('Company profile not found', 404);
    }

    return await this._companySubscriptionRepository.findActiveByCompanyId(companyProfile.id);
  }
}
