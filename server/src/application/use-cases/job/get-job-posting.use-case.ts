import { IJobPostingRepository } from 'src/domain/interfaces/repositories/job/IJobPostingRepository';
import { IGetJobPostingUseCase } from 'src/domain/interfaces/use-cases/job/IGetJobPostingUseCase';
import { NotFoundError } from 'src/domain/errors/errors';
import { JobPostingResponseDto } from 'src/application/dtos/admin/job/responses/job-posting-response.dto';
import { JobPostingMapper } from 'src/application/mappers/job/job-posting.mapper';

export class GetJobPostingUseCase implements IGetJobPostingUseCase {
  constructor(private readonly _jobPostingRepository: IJobPostingRepository) {}

  async execute(jobId: string): Promise<JobPostingResponseDto> {
    const jobPosting = await this._jobPostingRepository.findById(jobId);

    if (!jobPosting) {
      throw new NotFoundError('Job posting not found');
    }

    if (jobPosting.status === 'blocked') {
      throw new NotFoundError('Job posting not found');
    }

    return JobPostingMapper.toResponse(jobPosting);
  }
}


