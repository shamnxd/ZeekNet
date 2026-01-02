import { IJobPostingRepository } from 'src/domain/interfaces/repositories/job/IJobPostingRepository';
import { AppError } from 'src/domain/errors/errors';
import { IAdminGetJobStatsUseCase } from 'src/domain/interfaces/use-cases/admin/analytics/IAdminGetJobStatsUseCase';
import { AdminJobStatsResponseDto } from 'src/application/dtos/admin/job/responses/admin-job-response.dto';
import { JobPostingMapper } from 'src/application/mappers/job/job-posting.mapper';

export class AdminGetJobStatsUseCase implements IAdminGetJobStatsUseCase {
  constructor(private readonly _jobPostingRepository: IJobPostingRepository) {}

  async execute(): Promise<AdminJobStatsResponseDto> {
    const jobs = await this._jobPostingRepository.findMany({});
    return JobPostingMapper.toAdminStatsResponse(jobs);
  }
}


