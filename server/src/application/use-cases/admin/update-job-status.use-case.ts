import { IJobPostingRepository } from '../../../domain/interfaces/repositories/job/IJobPostingRepository';
import { IAdminUpdateJobStatusUseCase } from 'src/domain/interfaces/use-cases/admin/IAdminUpdateJobStatusUseCase';
import { NotFoundError, InternalServerError } from '../../../domain/errors/errors';
import { JobPosting } from '../../../domain/entities/job-posting.entity';
import { JobStatus } from '../../../domain/enums/job-status.enum';

export class AdminUpdateJobStatusUseCase implements IAdminUpdateJobStatusUseCase {
  constructor(private readonly _jobPostingRepository: IJobPostingRepository) {}

  async execute(jobId: string, status: JobStatus, unpublishReason?: string): Promise<JobPosting> {
    const job = await this._jobPostingRepository.findById(jobId);

    if (!job) {
      throw new NotFoundError('Job not found');
    }

    const updateData: { status: JobStatus; unpublishReason?: string } = {
      status: status,
    };

    if (status === JobStatus.BLOCKED && unpublishReason) {
      updateData.unpublishReason = unpublishReason;
    } else if (status === JobStatus.ACTIVE) {
      updateData.unpublishReason = undefined;
    }

    const updatedJob = await this._jobPostingRepository.update(jobId, updateData);

    if (!updatedJob) {
      throw new InternalServerError('Failed to update job status');
    }

    return updatedJob;
  }
}
