import { IJobPostingRepository } from '../../../domain/interfaces/repositories/job/IJobPostingRepository';
import { AppError } from '../../../domain/errors/errors';
import { IAdminGetJobStatsUseCase } from 'src/domain/interfaces/use-cases/admin/IAdminGetJobStatsUseCase';
import { AdminJobStatsResponseDto } from 'src/application/dto/admin/admin-job-response.dto';

export class AdminGetJobStatsUseCase implements IAdminGetJobStatsUseCase {
  constructor(private readonly _jobPostingRepository: IJobPostingRepository) {}

  async execute(): Promise<AdminJobStatsResponseDto> {
    const jobs = await this._jobPostingRepository.findMany({});

    const stats = {
      total: jobs.length,
      active: jobs.filter((job) => job.status === 'active').length,
      inactive: jobs.filter((job) => job.status !== 'active').length,
      totalApplications: jobs.reduce((sum, job) => sum + job.applicationCount, 0),
      totalViews: jobs.reduce((sum, job) => sum + job.viewCount, 0),
    };

    return stats;
  }
}
