import { IStripeService } from 'src/domain/interfaces/services/IStripeService';
import { ISubscriptionPlanRepository } from 'src/domain/interfaces/repositories/subscription-plan/ISubscriptionPlanRepository';
import { ICompanyProfileRepository } from 'src/domain/interfaces/repositories/company/ICompanyProfileRepository';
import { ICompanySubscriptionRepository } from 'src/domain/interfaces/repositories/subscription/ICompanySubscriptionRepository';
import { IJobPostingRepository } from 'src/domain/interfaces/repositories/job/IJobPostingRepository';
import { NotFoundError, ValidationError } from 'src/domain/errors/errors';
import { ILogger } from 'src/domain/interfaces/services/ILogger';
import { ChangeSubscriptionPlanRequestDto } from 'src/application/dtos/subscription/requests/change-subscription-plan.dto';
import { ChangeSubscriptionResult } from 'src/application/dtos/admin/subscription/responses/change-subscription-result.dto';
import { IChangeSubscriptionPlanUseCase } from 'src/domain/interfaces/use-cases/subscription/IChangeSubscriptionPlanUseCase';
import { BillingCycle } from 'src/domain/enums/billing-cycle.enum';
import { JobStatus } from 'src/domain/enums/job-status.enum';
import { SubscriptionStatus } from 'src/domain/enums/subscription-status.enum';
import { CompanySubscriptionMapper } from 'src/application/mappers/company/subscription/company-subscription.mapper';
import { PaymentSubscription } from 'src/domain/types/payment/payment-types';

export class ChangeSubscriptionPlanUseCase implements IChangeSubscriptionPlanUseCase {
  constructor(
    private readonly _stripeService: IStripeService,
    private readonly _subscriptionPlanRepository: ISubscriptionPlanRepository,
    private readonly _companyProfileRepository: ICompanyProfileRepository,
    private readonly _companySubscriptionRepository: ICompanySubscriptionRepository,
    private readonly _jobPostingRepository: IJobPostingRepository,
    private readonly _logger: ILogger,
  ) {}

  async execute(data: ChangeSubscriptionPlanRequestDto): Promise<ChangeSubscriptionResult> {
    const { userId, newPlanId, billingCycle } = data;
    if (!userId) throw new Error('User ID is required');
    const companyProfile = await this._companyProfileRepository.findOne({ userId });
    if (!companyProfile) {
      throw new NotFoundError('Company profile not found');
    }

    const subscription = await this._companySubscriptionRepository.findActiveByCompanyId(companyProfile.id);
    if (!subscription) {
      throw new NotFoundError('No active subscription found');
    }

    if (!subscription.stripeSubscriptionId) {
      throw new ValidationError('This subscription cannot be changed through Stripe');
    }

    const newPlan = await this._subscriptionPlanRepository.findById(newPlanId);
    if (!newPlan) {
      throw new NotFoundError('New subscription plan not found');
    }

    if (!newPlan.isActive) {
      throw new ValidationError('This subscription plan is not available');
    }

    if (newPlan.id === subscription.planId && billingCycle === subscription.billingCycle) {
      throw new ValidationError('You are already on this plan with this billing cycle');
    }

    const effectiveBillingCycle = billingCycle || subscription.billingCycle || BillingCycle.MONTHLY;
    
    const priceId = effectiveBillingCycle === BillingCycle.YEARLY  
      ? newPlan.stripePriceIdYearly 
      : newPlan.stripePriceIdMonthly;

    if (!priceId) {
      throw new ValidationError(`This plan does not have ${effectiveBillingCycle} pricing configured`);
    }

    const stripeSubscription: PaymentSubscription = await this._stripeService.updateSubscription({
      subscriptionId: subscription.stripeSubscriptionId,
      priceId,
      prorationBehavior: 'create_prorations',
    });

    const currentPlan = await this._subscriptionPlanRepository.findById(subscription.planId);
    const isDowngrade = currentPlan && newPlan.jobPostLimit < currentPlan.jobPostLimit;

    let unlistedCount = 0;
    let remainingRegularJobs = subscription.jobPostsUsed;
    let remainingFeaturedJobs = subscription.featuredJobsUsed;

    if (isDowngrade) {
      const allJobs = await this._jobPostingRepository.getJobsByCompany(companyProfile.id, {
        status: 1,
        isFeatured: 1,
        createdAt: 1,
      });

      const activeJobs = allJobs.filter(job => job.status === JobStatus.ACTIVE);
      
      activeJobs.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });

      const newJobLimit = newPlan.jobPostLimit === -1 ? activeJobs.length : newPlan.jobPostLimit;
      const jobsToKeep = activeJobs.slice(0, newJobLimit);
      const jobsToUnlist = activeJobs.slice(newJobLimit);

      for (const job of jobsToUnlist) {
        try {
          await this._jobPostingRepository.update(job.id!, { status: JobStatus.UNLISTED });
          unlistedCount++;
          this._logger.info(`Unlisted job ${job.id} for company ${companyProfile.id} due to plan downgrade`);
        } catch (error) {
          this._logger.error(`Failed to unlist job ${job.id} for company ${companyProfile.id}`, error);
        }
      }

      const remainingActiveJobs = jobsToKeep;
      remainingFeaturedJobs = remainingActiveJobs.filter(job => job.isFeatured).length;
      remainingRegularJobs = remainingActiveJobs.length - remainingFeaturedJobs;
    }

    const rawPeriodStart = stripeSubscription.currentPeriodStart;
    const rawPeriodEnd = stripeSubscription.currentPeriodEnd;
    
    const currentPeriodStart = rawPeriodStart 
      ? new Date(rawPeriodStart * 1000)
      : new Date();
    const currentPeriodEnd = rawPeriodEnd
      ? new Date(rawPeriodEnd * 1000)
      : new Date(Date.now() + (effectiveBillingCycle === BillingCycle.YEARLY ? 365 : 30) * 24 * 60 * 60 * 1000);

    const updatedSubscription = await this._companySubscriptionRepository.update(
      subscription.id,
      CompanySubscriptionMapper.toUpdateEntity({
        planId: newPlan.id,
        billingCycle: effectiveBillingCycle,
        stripeStatus: stripeSubscription.status as SubscriptionStatus,
        cancelAtPeriodEnd: stripeSubscription.cancelAtPeriodEnd || false,
        currentPeriodStart,
        currentPeriodEnd,
        startDate: currentPeriodStart,
        expiryDate: currentPeriodEnd,
        jobPostsUsed: remainingRegularJobs,
        featuredJobsUsed: remainingFeaturedJobs,
      }),
    );

    if (!updatedSubscription) {
      throw new Error('Failed to update subscription');
    }

    if (unlistedCount > 0) {
      this._logger.info(
        `Plan changed for company ${companyProfile.id}. Unlisted ${unlistedCount} job(s). ` +
        `Remaining active jobs: ${remainingRegularJobs} regular, ${remainingFeaturedJobs} featured`,
      );
    }

    return {
      subscription: {
        id: updatedSubscription.id,
        companyId: updatedSubscription.companyId,
        planId: updatedSubscription.planId,
        status: updatedSubscription.isActive ? 'active' : 'inactive',
        startDate: updatedSubscription.startDate!,
        endDate: updatedSubscription.expiryDate!,
      },
    };
  }
}




