import { ISubscriptionPlanRepository } from 'src/domain/interfaces/repositories/subscription-plan/ISubscriptionPlanRepository';
import { ICompanyProfileRepository } from 'src/domain/interfaces/repositories/company/ICompanyProfileRepository';
import { ICompanySubscriptionRepository } from 'src/domain/interfaces/repositories/subscription/ICompanySubscriptionRepository';
import { IJobPostingRepository } from 'src/domain/interfaces/repositories/job/IJobPostingRepository';
import { NotFoundError, ValidationError } from 'src/domain/errors/errors';
import { PreviewPlanChangeRequestDto } from 'src/application/dtos/subscription/requests/preview-plan-change.dto';
import { PreviewPlanChangeResponseDto, PlanChangeType, JobToUnlistDetail } from 'src/application/dtos/subscription/responses/preview-plan-change-response.dto';
import { IPreviewPlanChangeUseCase } from 'src/domain/interfaces/use-cases/subscription/IPreviewPlanChangeUseCase';
import { BillingCycle } from 'src/domain/enums/billing-cycle.enum';
import { JobStatus } from 'src/domain/enums/job-status.enum';

export class PreviewPlanChangeUseCase implements IPreviewPlanChangeUseCase {
  constructor(
        private readonly _subscriptionPlanRepository: ISubscriptionPlanRepository,
        private readonly _companyProfileRepository: ICompanyProfileRepository,
        private readonly _companySubscriptionRepository: ICompanySubscriptionRepository,
        private readonly _jobPostingRepository: IJobPostingRepository,
  ) { }

  async execute(data: PreviewPlanChangeRequestDto): Promise<PreviewPlanChangeResponseDto> {
    const { userId, newPlanId, billingCycle } = data;

    if (!userId) throw new Error('User ID is required');

    const companyProfile = await this._companyProfileRepository.findOne({ userId });
    if (!companyProfile) {
      throw new NotFoundError('Company profile not found');
    }

    // Get current subscription (may be null for new subscriptions)
    const subscription = await this._companySubscriptionRepository.findActiveByCompanyId(companyProfile.id);

    // Get new plan
    const newPlan = await this._subscriptionPlanRepository.findById(newPlanId);
    if (!newPlan) {
      throw new NotFoundError('New subscription plan not found');
    }

    if (!newPlan.isActive) {
      throw new ValidationError('This subscription plan is not available');
    }

    // Determine if this is a new subscription or a change
    if (!subscription) {
      // New subscription
      return {
        success: true,
        impact: {
          changeType: 'new' as PlanChangeType,
          jobsToUnlist: 0,
          jobsToUnlistDetails: [],
          featuredJobsToUnlist: 0,
          candidateViewsChange: newPlan.applicantAccessLimit,
          jobPostLimitChange: newPlan.jobPostLimit,
          featuredJobLimitChange: newPlan.featuredJobLimit,
          currentJobPostsUsed: 0,
          currentFeaturedJobsUsed: 0,
          newJobPostLimit: newPlan.jobPostLimit,
          newFeaturedJobLimit: newPlan.featuredJobLimit,
          newCandidateViewLimit: newPlan.applicantAccessLimit,
          billingCycleChange: false,
        },
        currentPlan: {
          id: '',
          name: 'Free Plan',
          price: 0,
          billingCycle: 'monthly',
        },
        newPlan: {
          id: newPlan.id,
          name: newPlan.name,
          price: billingCycle === 'yearly'
            ? newPlan.price * 12 * (1 - newPlan.yearlyDiscount / 100)
            : newPlan.price,
          billingCycle: billingCycle || 'monthly',
        },
      };
    }

    // Get current plan
    const currentPlan = await this._subscriptionPlanRepository.findById(subscription.planId);
    if (!currentPlan) {
      throw new NotFoundError('Current subscription plan not found');
    }

    // Check if same plan
    const effectiveBillingCycle = billingCycle || subscription.billingCycle || BillingCycle.MONTHLY;
    const isSamePlan = newPlan.id === subscription.planId;
    const isBillingCycleChange = effectiveBillingCycle !== subscription.billingCycle;

    if (isSamePlan && !isBillingCycleChange) {
      throw new ValidationError('You are already on this plan with this billing cycle');
    }

    // Determine change type
    let changeType: PlanChangeType;
    if (isSamePlan && isBillingCycleChange) {
      changeType = 'lateral';
    } else if (newPlan.jobPostLimit > currentPlan.jobPostLimit) {
      changeType = 'upgrade';
    } else if (newPlan.jobPostLimit < currentPlan.jobPostLimit) {
      changeType = 'downgrade';
    } else {
      // Same job limit but different features
      changeType = 'lateral';
    }

    // Calculate impact
    let jobsToUnlist = 0;
    let jobsToUnlistDetails: JobToUnlistDetail[] = [];
    let featuredJobsToUnlist = 0;

    if (changeType === 'downgrade') {
      // Get all active jobs
      const allJobs = await this._jobPostingRepository.getJobsByCompany(companyProfile.id, {
        status: 1,
        isFeatured: 1,
        createdAt: 1,
        title: 1,
      });

      const activeJobs = allJobs.filter(job => job.status === JobStatus.ACTIVE);

      // Sort by creation date (newest first)
      activeJobs.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });

      const newJobLimit = newPlan.jobPostLimit === -1 ? activeJobs.length : newPlan.jobPostLimit;
      const jobsToKeep = activeJobs.slice(0, newJobLimit);
      const jobsToUnlistArray = activeJobs.slice(newJobLimit);

      jobsToUnlist = jobsToUnlistArray.length;
      featuredJobsToUnlist = jobsToUnlistArray.filter(job => job.isFeatured).length;

      // Create details for jobs to unlist
      jobsToUnlistDetails = jobsToUnlistArray.map(job => ({
        id: job.id!,
        title: job.title || 'Untitled Job',
        applicantCount: job.applicationCount || 0,
        isFeatured: job.isFeatured || false,
        createdAt: typeof job.createdAt === 'string' ? job.createdAt : (job.createdAt || new Date()).toISOString(),
      }));
    }

    // Calculate changes
    const candidateViewsChange = newPlan.applicantAccessLimit - currentPlan.applicantAccessLimit;
    const jobPostLimitChange = newPlan.jobPostLimit - currentPlan.jobPostLimit;
    const featuredJobLimitChange = newPlan.featuredJobLimit - currentPlan.featuredJobLimit;

    return {
      success: true,
      impact: {
        changeType,
        jobsToUnlist,
        jobsToUnlistDetails,
        featuredJobsToUnlist,
        candidateViewsChange,
        jobPostLimitChange,
        featuredJobLimitChange,
        currentJobPostsUsed: subscription.jobPostsUsed,
        currentFeaturedJobsUsed: subscription.featuredJobsUsed,
        newJobPostLimit: newPlan.jobPostLimit,
        newFeaturedJobLimit: newPlan.featuredJobLimit,
        newCandidateViewLimit: newPlan.applicantAccessLimit,
        billingCycleChange: isBillingCycleChange,
      },
      currentPlan: {
        id: currentPlan.id,
        name: currentPlan.name,
        price: subscription.billingCycle === BillingCycle.YEARLY
          ? currentPlan.price * 12 * (1 - currentPlan.yearlyDiscount / 100)
          : currentPlan.price,
        billingCycle: subscription.billingCycle || 'monthly',
      },
      newPlan: {
        id: newPlan.id,
        name: newPlan.name,
        price: effectiveBillingCycle === BillingCycle.YEARLY
          ? newPlan.price * 12 * (1 - newPlan.yearlyDiscount / 100)
          : newPlan.price,
        billingCycle: effectiveBillingCycle,
      },
    };
  }
}
