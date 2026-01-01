import { ICompanySubscriptionRepository } from '../../../domain/interfaces/repositories/subscription/ICompanySubscriptionRepository';
import { ICompanyProfileRepository } from '../../../domain/interfaces/repositories/company/ICompanyProfileRepository';
import { IJobPostingRepository } from '../../../domain/interfaces/repositories/job/IJobPostingRepository';
import { CompanySubscription } from '../../../domain/entities/company-subscription.entity';
import { NotFoundError } from '../../../domain/errors/errors';
import { IGetActiveSubscriptionUseCase } from '../../interfaces/use-cases/subscriptions/IGetActiveSubscriptionUseCase';

export class GetActiveSubscriptionUseCase implements IGetActiveSubscriptionUseCase {
  constructor(
    private _companySubscriptionRepository: ICompanySubscriptionRepository,
    private _companyProfileRepository: ICompanyProfileRepository,
    private _jobPostingRepository: IJobPostingRepository,
  ) {}

  async execute(userId: string): Promise<(CompanySubscription & { activeJobCount?: number }) | null> {
    const companyProfile = await this._companyProfileRepository.findOne({ userId });
    
    if (!companyProfile) {
      throw new NotFoundError('Company profile not found');
    }

    const subscription = await this._companySubscriptionRepository.findActiveByCompanyId(companyProfile.id);
    
    if (!subscription) {
      return null;
    }

    const jobs = await this._jobPostingRepository.getJobsByCompany(companyProfile.id, { status: 1 });
    const activeJobCount = jobs.filter(job => job.status === 'active').length;

    return Object.assign(subscription, { activeJobCount }) as CompanySubscription & { activeJobCount?: number };
  }
}
