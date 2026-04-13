import { injectable, inject } from 'inversify';
import { TYPES } from 'src/shared/constants/types';
import { ICompanySubscriptionRepository } from 'src/domain/interfaces/repositories/subscription/ICompanySubscriptionRepository';
import { ICompanyProfileRepository } from 'src/domain/interfaces/repositories/company/ICompanyProfileRepository';
import { IJobPostingRepository } from 'src/domain/interfaces/repositories/job/IJobPostingRepository';
import { ISubscriptionPlanRepository } from 'src/domain/interfaces/repositories/subscription-plan/ISubscriptionPlanRepository';
import { CompanySubscription } from 'src/domain/entities/company-subscription.entity';
import { NotFoundError } from 'src/domain/errors/errors';
import { IGetActiveSubscriptionUseCase } from 'src/domain/interfaces/use-cases/subscription/IGetActiveSubscriptionUseCase';
import { CompanySubscriptionResponseDto } from 'src/application/dtos/subscription/responses/subscription-response.dto';
import { CompanySubscriptionResponseMapper } from 'src/application/mappers/company/subscription/company-subscription-response.mapper';
import { ERROR } from 'src/shared/constants/messages';


@injectable()
export class GetActiveSubscriptionUseCase implements IGetActiveSubscriptionUseCase {
  constructor(
    @inject(TYPES.CompanySubscriptionRepository) private _companySubscriptionRepository: ICompanySubscriptionRepository,
    @inject(TYPES.CompanyProfileRepository) private _companyProfileRepository: ICompanyProfileRepository,
    @inject(TYPES.JobPostingRepository) private _jobPostingRepository: IJobPostingRepository,
    @inject(TYPES.SubscriptionPlanRepository) private _subscriptionPlanRepository: ISubscriptionPlanRepository,
  ) { }

  async execute(userId: string): Promise<CompanySubscriptionResponseDto | null> {
    const companyProfile = await this._companyProfileRepository.findOne({ userId });

    if (!companyProfile) {
      throw new NotFoundError(ERROR.NOT_FOUND('Company profile'));
    }

    let subscription = await this._companySubscriptionRepository.findActiveByCompanyId(companyProfile.id);

    // If subscription is expired, fall back to default plan
    if (!subscription || (subscription && subscription.isExpired() && !subscription.isDefault)) {
      const defaultPlan = await this._subscriptionPlanRepository.findDefault();
      if (defaultPlan) {
        subscription = CompanySubscription.create({
          id: subscription?.id || '',
          companyId: companyProfile.id,
          planId: defaultPlan.id,
          startDate: null,
          expiryDate: null,
          isActive: true,
          jobPostsUsed: subscription?.jobPostsUsed || 0,
          featuredJobsUsed: subscription?.featuredJobsUsed || 0,
          applicantAccessUsed: subscription?.applicantAccessUsed || 0,
          planName: defaultPlan.name,
          jobPostLimit: defaultPlan.jobPostLimit,
          featuredJobLimit: defaultPlan.featuredJobLimit,
          applicantAccessLimit: defaultPlan.applicantAccessLimit,
          isDefault: true,
        });
      } else {
        return null;
      }
    }

    const jobs = await this._jobPostingRepository.getJobsByCompany(companyProfile.id, { status: 1 });
    const activeJobCount = jobs.filter(job => job.status === 'active').length;

    const plan = await this._subscriptionPlanRepository.findById(subscription.planId);
    const featuredJobsResult = await this._jobPostingRepository.paginate({
      company_id: companyProfile.id,
      is_featured: true,
      status: 'active',
    }, { page: 1, limit: 1 });

    subscription = CompanySubscription.create({
      ...subscription,
      featuredJobsUsed: featuredJobsResult.total,
      applicantAccessLimit: plan?.applicantAccessLimit || subscription.applicantAccessLimit,
    });

    return CompanySubscriptionResponseMapper.toResponse(
      Object.assign(subscription, { activeJobCount }),
    );
  }
}
