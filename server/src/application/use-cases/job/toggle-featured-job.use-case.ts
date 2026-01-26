import { IJobPostingRepository } from 'src/domain/interfaces/repositories/job/IJobPostingRepository';
import { ICompanyProfileRepository } from 'src/domain/interfaces/repositories/company/ICompanyProfileRepository';
import { ICompanySubscriptionRepository } from 'src/domain/interfaces/repositories/subscription/ICompanySubscriptionRepository';
import { IToggleFeaturedJobUseCase } from 'src/domain/interfaces/use-cases/job/IToggleFeaturedJobUseCase';
import { ToggleFeaturedJobDto } from 'src/application/dtos/company/job/requests/toggle-featured-job.dto';
import { JobPostingResponseDto } from 'src/application/dtos/admin/job/responses/job-posting-response.dto';
import { JobPostingMapper } from 'src/application/mappers/job/job-posting.mapper';
import { NotFoundError, ConflictError, AuthorizationError } from 'src/domain/errors/errors';
import { JobStatus } from 'src/domain/enums/job-status.enum';
import { JobPosting } from 'src/domain/entities/job-posting.entity';

export class ToggleFeaturedJobUseCase implements IToggleFeaturedJobUseCase {
  constructor(
    private readonly _jobPostingRepository: IJobPostingRepository,
    private readonly _companyProfileRepository: ICompanyProfileRepository,
    private readonly _companySubscriptionRepository: ICompanySubscriptionRepository,
  ) { }

  async execute(data: ToggleFeaturedJobDto): Promise<JobPostingResponseDto> {
    const { userId, jobId } = data;

    const companyProfile = await this._companyProfileRepository.findOne({ userId });
    if (!companyProfile) {
      throw new NotFoundError('Company profile not found');
    }

    const jobPosting = await this._jobPostingRepository.findById(jobId);
    if (!jobPosting) {
      throw new NotFoundError('Job posting not found');
    }

    if (jobPosting.companyId?.toString() !== companyProfile.id?.toString()) {
      throw new AuthorizationError('You do not have permission to modify this job posting');
    }

    if (jobPosting.status === JobStatus.BLOCKED || jobPosting.status === JobStatus.CLOSED) {
      throw new ConflictError('Cannot feature a blocked or closed job');
    }

    const newIsFeatured = !jobPosting.isFeatured;

    if (newIsFeatured) {
      const subscription = await this._companySubscriptionRepository.findOne({ companyId: companyProfile.id });
      if (!subscription) {
        throw new ConflictError('No active subscription found');
      }

      const featuredJobLimit = subscription.featuredJobLimit || 0;

      const featuredJobsResult = await this._jobPostingRepository.paginate({
        companyId: companyProfile.id,
        isFeatured: true,
      }, { page: 1, limit: 1000, sortBy: 'createdAt', sortOrder: 'desc' });

      if (featuredJobsResult.total >= featuredJobLimit) {
        throw new ConflictError(`You have reached your featured jobs limit (${featuredJobLimit}). Upgrade your plan to feature more jobs.`);
      }
    }

    const updatedJob = await this._jobPostingRepository.update(jobId, { isFeatured: newIsFeatured } as Partial<JobPosting>);

    if (!updatedJob) {
      throw new Error('Failed to update job posting');
    }

    return JobPostingMapper.toResponse(updatedJob);
  }
}
