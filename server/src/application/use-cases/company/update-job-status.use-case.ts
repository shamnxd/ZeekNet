import { IJobPostingRepository } from '../../../domain/interfaces/repositories/job/IJobPostingRepository';
import { ICompanySubscriptionRepository } from '../../../domain/interfaces/repositories/subscription/ICompanySubscriptionRepository';
import { ICompanyProfileRepository } from '../../../domain/interfaces/repositories/company/ICompanyProfileRepository';
import { AppError, ValidationError } from '../../../domain/errors/errors';
import { JobPosting } from '../../../domain/entities/job-posting.entity';
import { IUpdateJobStatusUseCase } from 'src/domain/interfaces/use-cases/jobs/IUpdateJobStatusUseCase';
import { UpdateJobStatusDto } from '../../dto/jobs/update-job-status.dto';
import { JobStatus } from '../../../domain/enums/job-status.enum';

export class UpdateJobStatusUseCase implements IUpdateJobStatusUseCase {
  constructor(
    private readonly _jobPostingRepository: IJobPostingRepository,
    private readonly _companySubscriptionRepository: ICompanySubscriptionRepository,
    private readonly _companyProfileRepository: ICompanyProfileRepository,
  ) {}

  async execute(dto: UpdateJobStatusDto): Promise<JobPosting> {
    const { jobId, status, userId } = dto;
    const existingJob = await this._jobPostingRepository.findById(jobId);

    if (!existingJob) {
      throw new AppError('Job not found', 404);
    }

    if (existingJob.status === JobStatus.BLOCKED) {
      throw new AppError('This job has been blocked by admin and cannot be modified', 403);
    }

    const oldStatus = existingJob.status;
    const newStatus = status;

    if (userId && newStatus === JobStatus.ACTIVE && oldStatus !== JobStatus.ACTIVE) {
      const companyProfile = await this._companyProfileRepository.findOne({ userId });
      if (!companyProfile) {
        throw new AppError('Company profile not found', 404);
      }

      const subscription = await this._companySubscriptionRepository.findActiveByCompanyId(companyProfile.id);
      if (!subscription) {
        throw new ValidationError('You need an active subscription to list jobs');
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
      throw new AppError('Failed to update job status', 500);
    }

    return updatedJob;
  }
}

