import { ICompanySubscriptionRepository } from 'src/domain/interfaces/repositories/subscription/ICompanySubscriptionRepository';
import { ICompanyProfileRepository } from 'src/domain/interfaces/repositories/company/ICompanyProfileRepository';
import { IJobPostingRepository } from 'src/domain/interfaces/repositories/job/IJobPostingRepository';
import { ISubscriptionPlanRepository } from 'src/domain/interfaces/repositories/subscription-plan/ISubscriptionPlanRepository';
import { CompanySubscription } from 'src/domain/entities/company-subscription.entity';
import { NotFoundError } from 'src/domain/errors/errors';
import { IGetActiveSubscriptionUseCase } from 'src/domain/interfaces/use-cases/subscription/IGetActiveSubscriptionUseCase';
import { CompanySubscriptionResponseDto } from 'src/application/dtos/subscription/responses/subscription-response.dto';
import { CompanySubscriptionResponseMapper } from 'src/application/mappers/company/subscription/company-subscription-response.mapper';

export class GetActiveSubscriptionUseCase implements IGetActiveSubscriptionUseCase {
  constructor(
    private _companySubscriptionRepository: ICompanySubscriptionRepository,
    private _companyProfileRepository: ICompanyProfileRepository,
    private _jobPostingRepository: IJobPostingRepository,
    private _subscriptionPlanRepository: ISubscriptionPlanRepository,
  ) { }

  async execute(userId: string): Promise<CompanySubscriptionResponseDto | null> {
    const companyProfile = await this._companyProfileRepository.findOne({ userId });

    if (!companyProfile) {
      throw new NotFoundError('Company profile not found');
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

    // Get the plan to include applicantAccessLimit in response
    const plan = await this._subscriptionPlanRepository.findById(subscription.planId);

    // Sync featured jobs count
    const featuredJobsResult = await this._jobPostingRepository.paginate({
      companyId: companyProfile.id,
      isFeatured: true,
      status: 'active',
    }, { page: 1, limit: 1 });

    // Update local subscription object for response
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
