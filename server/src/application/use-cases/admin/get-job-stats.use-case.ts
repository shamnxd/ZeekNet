import { IJobPostingRepository } from '../../../domain/interfaces/repositories/job/IJobPostingRepository';
import { AppError } from '../../../domain/errors/errors';
import { IAdminGetJobStatsUseCase, AdminJobStats } from '../../../domain/interfaces/use-cases/IAdminUseCases';

export class AdminGetJobStatsUseCase implements IAdminGetJobStatsUseCase {
  constructor(private readonly _jobPostingRepository: IJobPostingRepository) {}

  async execute(): Promise<AdminJobStats> {
    try {
      const jobs = await this._jobPostingRepository.findMany({});

      const stats = {
        total: jobs.length,
        active: jobs.filter((job) => job.isActive).length,
        inactive: jobs.filter((job) => !job.isActive).length,
        totalApplications: jobs.reduce((sum, job) => sum + job.applicationCount, 0),
        totalViews: jobs.reduce((sum, job) => sum + job.viewCount, 0),
      };

      return stats;
    } catch (error) {
      throw new AppError('Failed to fetch job statistics', 500);
    }
  }
}
