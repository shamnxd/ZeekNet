import { IJobPostingRepository } from 'src/domain/interfaces/repositories/job/IJobPostingRepository';
import { ICompanySubscriptionRepository } from 'src/domain/interfaces/repositories/subscription/ICompanySubscriptionRepository';
import { ISubscriptionPlanRepository } from 'src/domain/interfaces/repositories/subscription-plan/ISubscriptionPlanRepository';
import { ICompanyProfileRepository } from 'src/domain/interfaces/repositories/company/ICompanyProfileRepository';
import { CompanySubscription } from 'src/domain/entities/company-subscription.entity';
import { AuthorizationError, InternalServerError, NotFoundError, ValidationError } from 'src/domain/errors/errors';
import { JobPosting } from 'src/domain/entities/job-posting.entity';
import { IUpdateJobStatusUseCase } from 'src/domain/interfaces/use-cases/job/IUpdateJobStatusUseCase';
import { UpdateJobStatusDto } from 'src/application/dtos/job/requests/update-job-status.dto';
import { JobStatus } from 'src/domain/enums/job-status.enum';
import { JobPostingResponseDto } from 'src/application/dtos/admin/job/responses/job-posting-response.dto';
import { JobPostingMapper } from 'src/application/mappers/job/job-posting.mapper';

export class UpdateJobStatusUseCase implements IUpdateJobStatusUseCase {
  constructor(
    private readonly _jobPostingRepository: IJobPostingRepository,
    private readonly _companySubscriptionRepository: ICompanySubscriptionRepository,
    private readonly _companyProfileRepository: ICompanyProfileRepository,
    private readonly _subscriptionPlanRepository: ISubscriptionPlanRepository,
  ) { }

  async execute(dto: UpdateJobStatusDto): Promise<JobPostingResponseDto> {
    const { jobId, status, userId } = dto;
    const existingJob = await this._jobPostingRepository.findById(jobId);

    if (!existingJob) {
      throw new NotFoundError('Job not found');
    }

    if (existingJob.status === JobStatus.BLOCKED) {
      throw new AuthorizationError('This job has been blocked by admin and cannot be modified');
    }


    if (existingJob.status === JobStatus.CLOSED) {
      throw new ValidationError('Closed jobs cannot be reopened. They remain permanently closed for consistency and audit safety.');
    }

    const oldStatus = existingJob.status;
    const newStatus = status;

    if (userId && newStatus === JobStatus.ACTIVE && oldStatus !== JobStatus.ACTIVE) {
      const companyProfile = await this._companyProfileRepository.findOne({ userId });
      if (!companyProfile) {
        throw new NotFoundError('Company profile not found');
      }

      let subscription = await this._companySubscriptionRepository.findActiveByCompanyId(companyProfile.id);
      
      // If subscription is expired, fall back to default plan
      if (!subscription || (subscription && subscription.isExpired() && !subscription.isDefault)) {
        const defaultPlan = await this._subscriptionPlanRepository.findDefault();
        if (defaultPlan) {
          // If subscription exists but is expired, update it to default plan
          if (subscription && subscription.isExpired()) {
            await this._companySubscriptionRepository.update(subscription.id, {
              planId: defaultPlan.id,
              startDate: null,
              expiryDate: null,
              isActive: true,
            });
          }
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
          throw new ValidationError('You need an active subscription to list jobs');
        }
      }

      if (existingJob.isFeatured) {
        if (!subscription.canPostFeaturedJob()) {
          throw new ValidationError(
            `You have reached your active featured job limit of ${subscription.featuredJobLimit} jobs. Please upgrade your plan or unlist other featured jobs.`,
          );
        }
      }

      if (!subscription.canPostJob()) {
        throw new ValidationError(
          `You have reached your active job limit of ${subscription.jobPostLimit} jobs. Please upgrade your plan or unlist other jobs.`,
        );
      }

      if (existingJob.isFeatured) {
        await this._companySubscriptionRepository.incrementFeaturedJobsUsed(subscription.id);
      }
      await this._companySubscriptionRepository.incrementJobPostsUsed(subscription.id);
    }

    if (userId && oldStatus === JobStatus.ACTIVE && newStatus !== JobStatus.ACTIVE) {
      const companyProfile = await this._companyProfileRepository.findOne({ userId });
      if (companyProfile) {
        const subscription = await this._companySubscriptionRepository.findActiveByCompanyId(companyProfile.id);
        if (subscription) {
          if (existingJob.isFeatured) {
            await this._companySubscriptionRepository.decrementFeaturedJobsUsed(subscription.id);
          }
          await this._companySubscriptionRepository.decrementJobPostsUsed(subscription.id);
        }
      }
    }

    const updatedJob = await this._jobPostingRepository.update(jobId, { status });

    if (!updatedJob) {
      throw new InternalServerError('Failed to update job status');
    }

    return JobPostingMapper.toResponse(updatedJob);
  }
}
