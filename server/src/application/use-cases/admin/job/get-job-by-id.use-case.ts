import { IJobPostingRepository } from 'src/domain/interfaces/repositories/job/IJobPostingRepository';
import { IAdminGetJobByIdUseCase } from 'src/domain/interfaces/use-cases/admin/job/IAdminGetJobByIdUseCase';
import { NotFoundError } from 'src/domain/errors/errors';
import { JobPostingResponseDto } from 'src/application/dtos/admin/job/responses/job-posting-response.dto';
import { JobPostingMapper } from 'src/application/mappers/job/job-posting.mapper';

import { IS3Service } from 'src/domain/interfaces/services/IS3Service';

export class AdminGetJobByIdUseCase implements IAdminGetJobByIdUseCase {
  constructor(
    private readonly _jobPostingRepository: IJobPostingRepository,
    private readonly _s3Service: IS3Service,
  ) { }

  async execute(jobId: string): Promise<JobPostingResponseDto> {
    const job = await this._jobPostingRepository.findById(jobId);

    if (!job) {
      throw new NotFoundError('Job not found');
    }

    const response = JobPostingMapper.toResponse(job);

    if (response.company_logo && !response.company_logo.startsWith('http')) {
      response.company_logo = await this._s3Service.getSignedUrl(response.company_logo);
    }

    return response;
  }
}
