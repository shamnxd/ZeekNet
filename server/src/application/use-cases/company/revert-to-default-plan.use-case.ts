import { ICompanySubscriptionRepository } from '../../../domain/interfaces/repositories/subscription/ICompanySubscriptionRepository';
import { ISubscriptionPlanRepository } from '../../../domain/interfaces/repositories/subscription-plan/ISubscriptionPlanRepository';
import { IJobPostingRepository } from '../../../domain/interfaces/repositories/job/IJobPostingRepository';
import { ICompanyProfileRepository } from '../../../domain/interfaces/repositories/company/ICompanyProfileRepository';
import { INotificationRepository } from '../../../domain/interfaces/repositories/notification/INotificationRepository';
import { CompanySubscription } from '../../../domain/entities/company-subscription.entity';
import { NotFoundError } from '../../../domain/errors/errors';
import { NotificationType, Notification } from '../../../domain/entities/notification.entity';
import { logger } from '../../../infrastructure/config/logger';
import { IRevertToDefaultPlanUseCase } from '../../../domain/interfaces/use-cases/subscriptions/IRevertToDefaultPlanUseCase';
import { JobStatus } from '../../../domain/enums/job-status.enum';

export class RevertToDefaultPlanUseCase implements IRevertToDefaultPlanUseCase {
  constructor(
    private readonly _companySubscriptionRepository: ICompanySubscriptionRepository,
    private readonly _subscriptionPlanRepository: ISubscriptionPlanRepository,
    private readonly _jobPostingRepository: IJobPostingRepository,
    private readonly _companyProfileRepository: ICompanyProfileRepository,
    private readonly _notificationRepository: INotificationRepository,
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
      logger.info(`Company ${companyId} is already on default plan`);
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
        logger.info(`Unlisted job ${job.id} for company ${companyId} due to plan downgrade`);
      } catch (error) {
        logger.error(`Failed to unlist job ${job.id} for company ${companyId}`, error);
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
    } as Partial<CompanySubscription>);

    if (!updatedSubscription) {
      throw new Error('Failed to update subscription to default plan');
    }

    const companyProfile = await this._companyProfileRepository.findById(companyId);
    if (companyProfile) {
      await this._notificationRepository.create({
        userId: companyProfile.userId,
        title: 'Subscription Reverted to Default Plan',
        message: unlistedCount > 0
          ? `Your subscription has been reverted to the default plan. ${unlistedCount} job(s) have been unlisted to comply with the default plan limit.`
          : 'Your subscription has been reverted to the default plan.',
        type: NotificationType.SYSTEM,
        isRead: false,
      } as Omit<Notification, 'id' | '_id' | 'createdAt' | 'updatedAt'>);
    }

    logger.info(
      `Reverted company ${companyId} to default plan. Unlisted ${unlistedCount} job(s). ` +
      `Remaining active jobs: ${remainingRegularJobs} regular, ${remainingFeaturedJobs} featured`,
    );

    return updatedSubscription;
  }
}
