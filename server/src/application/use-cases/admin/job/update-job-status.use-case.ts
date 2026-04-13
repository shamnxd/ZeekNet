import { IJobPostingRepository } from 'src/domain/interfaces/repositories/job/IJobPostingRepository';
import { IAdminUpdateJobStatusUseCase } from 'src/domain/interfaces/use-cases/admin/job/IAdminUpdateJobStatusUseCase';
import { NotFoundError, InternalServerError } from 'src/domain/errors/errors';
import { JobStatus } from 'src/domain/enums/job-status.enum';
import { UpdateJobStatusRequestDto } from 'src/application/dtos/admin/job/requests/update-job-status-request.dto';
import { JobPostingResponseDto } from 'src/application/dtos/admin/job/responses/job-posting-response.dto';
import { JobPostingMapper } from 'src/application/mappers/job/job-posting.mapper';
import { injectable, inject } from 'inversify';
import { TYPES } from 'src/shared/constants/types';
import { ERROR } from 'src/shared/constants/messages';

@injectable()
export class AdminUpdateJobStatusUseCase implements IAdminUpdateJobStatusUseCase {
  constructor(@inject(TYPES.JobPostingRepository) private readonly _jobPostingRepository: IJobPostingRepository) { }

  async execute(jobId: string, dto: UpdateJobStatusRequestDto): Promise<JobPostingResponseDto> {
    const { status, unpublish_reason: unpublishReason } = dto;

    const job = await this._jobPostingRepository.findById(jobId);

    if (!job) {
      throw new NotFoundError(ERROR.NOT_FOUND('Job'));
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
      throw new InternalServerError(ERROR.FAILED_TO('update job status'));
    }

    return JobPostingMapper.toResponse(updatedJob);
  }
}
