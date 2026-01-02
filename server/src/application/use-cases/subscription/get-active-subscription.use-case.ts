import { ICompanySubscriptionRepository } from 'src/domain/interfaces/repositories/subscription/ICompanySubscriptionRepository';
import { ICompanyProfileRepository } from 'src/domain/interfaces/repositories/company/ICompanyProfileRepository';
import { IJobPostingRepository } from 'src/domain/interfaces/repositories/job/IJobPostingRepository';
import { CompanySubscription } from 'src/domain/entities/company-subscription.entity';
import { NotFoundError } from 'src/domain/errors/errors';
import { IGetActiveSubscriptionUseCase } from 'src/domain/interfaces/use-cases/subscription/IGetActiveSubscriptionUseCase';
import { ActiveSubscriptionResponseDto } from 'src/application/dtos/subscription/responses/active-subscription-response.dto';
import { CompanySubscriptionMapper } from 'src/infrastructure/mappers/persistence/mongodb/company/company-subscription.mapper';

export class GetActiveSubscriptionUseCase implements IGetActiveSubscriptionUseCase {
  constructor(
    private _companySubscriptionRepository: ICompanySubscriptionRepository,
    private _companyProfileRepository: ICompanyProfileRepository,
    private _jobPostingRepository: IJobPostingRepository,
  ) {}

  async execute(userId: string): Promise<ActiveSubscriptionResponseDto | null> {
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

    return {
      id: subscription.id,
      companyId: subscription.companyId,
      planId: subscription.planId,
      status: subscription.isActive ? 'active' : 'inactive',
      startDate: subscription.startDate!,
      endDate: subscription.expiryDate!,
      activeJobCount,
    };
  }
}

