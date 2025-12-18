import { IJobPostingRepository } from '../../../domain/interfaces/repositories/job/IJobPostingRepository';
import { AppError } from '../../../domain/errors/errors';
import { IAdminGetJobStatsUseCase } from 'src/domain/interfaces/use-cases/admin/IAdminGetJobStatsUseCase';
import { AdminJobStatsResponseDto } from 'src/application/dto/admin/admin-job-response.dto';
import { JobPostingMapper } from '../../mappers/job-posting.mapper';

export class AdminGetJobStatsUseCase implements IAdminGetJobStatsUseCase {
  constructor(private readonly _jobPostingRepository: IJobPostingRepository) {}

  async execute(): Promise<AdminJobStatsResponseDto> {
    const jobs = await this._jobPostingRepository.findMany({});
    return JobPostingMapper.toAdminStatsResponse(jobs);
  }
}
