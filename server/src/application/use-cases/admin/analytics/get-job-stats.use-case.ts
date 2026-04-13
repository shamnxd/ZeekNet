import { IJobPostingRepository } from 'src/domain/interfaces/repositories/job/IJobPostingRepository';
import { AppError } from 'src/domain/errors/errors';
import { IAdminGetJobStatsUseCase } from 'src/domain/interfaces/use-cases/admin/analytics/IAdminGetJobStatsUseCase';
import { AdminJobStatsResponseDto } from 'src/application/dtos/admin/job/responses/admin-job-response.dto';
import { JobPostingMapper } from 'src/application/mappers/job/job-posting.mapper';
import { injectable, inject } from 'inversify';
import { TYPES } from 'src/shared/constants/types';

@injectable()
export class AdminGetJobStatsUseCase implements IAdminGetJobStatsUseCase {
  constructor(@inject(TYPES.JobPostingRepository) private readonly _jobPostingRepository: IJobPostingRepository) {}

  async execute(): Promise<AdminJobStatsResponseDto> {
    const jobs = await this._jobPostingRepository.findMany({});
    return JobPostingMapper.toAdminStatsResponse(jobs);
  }
}


