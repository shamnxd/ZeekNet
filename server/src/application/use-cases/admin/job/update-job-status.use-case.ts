import { IJobPostingRepository } from 'src/domain/interfaces/repositories/job/IJobPostingRepository';
import { IAdminUpdateJobStatusUseCase } from 'src/domain/interfaces/use-cases/admin/job/IAdminUpdateJobStatusUseCase';
import { NotFoundError, InternalServerError } from 'src/domain/errors/errors';
import { JobStatus } from 'src/domain/enums/job-status.enum';
import { UpdateJobStatusRequestDto } from 'src/application/dtos/admin/job/requests/update-job-status-request.dto';
import { JobPostingResponseDto } from 'src/application/dtos/admin/job/responses/job-posting-response.dto';
import { JobPostingMapper } from 'src/application/mappers/job/job-posting.mapper';

export class AdminUpdateJobStatusUseCase implements IAdminUpdateJobStatusUseCase {
  constructor(private readonly _jobPostingRepository: IJobPostingRepository) { }

  async execute(jobId: string, dto: UpdateJobStatusRequestDto): Promise<JobPostingResponseDto> {
    const { status, unpublish_reason: unpublishReason } = dto;

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

    return JobPostingMapper.toResponse(updatedJob);
  }
}
