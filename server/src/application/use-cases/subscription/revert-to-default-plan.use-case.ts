import { ICompanySubscriptionRepository } from 'src/domain/interfaces/repositories/subscription/ICompanySubscriptionRepository';
import { ISubscriptionPlanRepository } from 'src/domain/interfaces/repositories/subscription-plan/ISubscriptionPlanRepository';
import { IJobPostingRepository } from 'src/domain/interfaces/repositories/job/IJobPostingRepository';
import { ICompanyProfileRepository } from 'src/domain/interfaces/repositories/company/ICompanyProfileRepository';
import { INotificationRepository } from 'src/domain/interfaces/repositories/notification/INotificationRepository';
import { CompanySubscription } from 'src/domain/entities/company-subscription.entity';
import { NotFoundError } from 'src/domain/errors/errors';
import { NotificationMapper } from 'src/application/mappers/notification/notification.mapper';
import { NotificationType } from 'src/domain/enums/notification-type.enum';
import { ILogger } from 'src/domain/interfaces/services/ILogger';
import { IRevertToDefaultPlanUseCase } from 'src/domain/interfaces/use-cases/subscription/IRevertToDefaultPlanUseCase';
import { JobStatus } from 'src/domain/enums/job-status.enum';

export class RevertToDefaultPlanUseCase implements IRevertToDefaultPlanUseCase {
  constructor(
    private readonly _companySubscriptionRepository: ICompanySubscriptionRepository,
    private readonly _subscriptionPlanRepository: ISubscriptionPlanRepository,
    private readonly _jobPostingRepository: IJobPostingRepository,
    private readonly _companyProfileRepository: ICompanyProfileRepository,
    private readonly _notificationRepository: INotificationRepository,
    private readonly _logger: ILogger,
  ) {}

  async execute(companyId: string): Promise<CompanySubscription> {
    const defaultPlan = await this._subscriptionPlanRepository.findDefault();
    if (!defaultPlan) {
      throw new NotFoundError('Default subscription plan not found');
    }

    let currentSubscription = await this._companySubscriptionRepository.findActiveByCompanyId(companyId);
    
    if (!currentSubscription) {
      const allSubscriptions = await this._companySubscriptionRepository.findByCompanyId(companyId);
      if (allSubscriptions.length === 0) {
        throw new NotFoundError('No subscription found for company');
      }
      currentSubscription = allSubscriptions.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )[0];
    }

    if (currentSubscription.planId === defaultPlan.id) {
      this._logger.info(`Company ${companyId} is already on default plan`);
      return currentSubscription;
    }

    const allJobs = await this._jobPostingRepository.getJobsByCompany(companyId, {
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

    const defaultJobLimit = defaultPlan.jobPostLimit === -1 ? activeJobs.length : defaultPlan.jobPostLimit;
    const jobsToKeep = activeJobs.slice(0, defaultJobLimit);
    const jobsToUnlist = activeJobs.slice(defaultJobLimit);

    let unlistedCount = 0;
    for (const job of jobsToUnlist) {
      try {
        await this._jobPostingRepository.update(job.id!, { status: JobStatus.UNLISTED });
        unlistedCount++;
        this._logger.info(`Unlisted job ${job.id} for company ${companyId} due to plan downgrade`);
      } catch (error) {
        this._logger.error(`Failed to unlist job ${job.id} for company ${companyId}`, error);
      }
    }

    const remainingActiveJobs = jobsToKeep;
    const remainingFeaturedJobs = remainingActiveJobs.filter(job => job.isFeatured).length;
    const remainingRegularJobs = remainingActiveJobs.length - remainingFeaturedJobs;

    const updatedSubscription = await this._companySubscriptionRepository.update(currentSubscription.id, {
      planId: defaultPlan.id,
      startDate: null,
      expiryDate: null,
      isActive: true,
      jobPostsUsed: remainingRegularJobs,
      featuredJobsUsed: remainingFeaturedJobs,
      stripeStatus: undefined,
      stripeCustomerId: undefined,
      stripeSubscriptionId: undefined,
      cancelAtPeriodEnd: false,
      currentPeriodStart: undefined,
      currentPeriodEnd: undefined,
      billingCycle: undefined,
    });

    if (!updatedSubscription) {
      throw new Error('Failed to update subscription to default plan');
    }

    const companyProfile = await this._companyProfileRepository.findById(companyId);
    if (companyProfile) {
      await this._notificationRepository.create(
        NotificationMapper.toEntity({
          userId: companyProfile.userId,
          title: 'Subscription Reverted to Default Plan',
          message: unlistedCount > 0
            ? `Your subscription has been reverted to the default plan. ${unlistedCount} job(s) have been unlisted to comply with the default plan limit.`
            : 'Your subscription has been reverted to the default plan.',
          type: NotificationType.SYSTEM,
          isRead: false,
        }),
      );
    }

    this._logger.info(
      `Reverted company ${companyId} to default plan. Unlisted ${unlistedCount} job(s). ` +
      `Remaining active jobs: ${remainingRegularJobs} regular, ${remainingFeaturedJobs} featured`,
    );

    return updatedSubscription;
  }
}


