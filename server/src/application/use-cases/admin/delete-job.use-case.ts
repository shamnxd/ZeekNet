import { IJobPostingRepository } from '../../../domain/interfaces/repositories/job/IJobPostingRepository';
import { IAdminDeleteJobUseCase } from '../../../domain/interfaces/use-cases/IAdminUseCases';
import { AppError } from '../../../domain/errors/errors';

export class AdminDeleteJobUseCase implements IAdminDeleteJobUseCase {
  constructor(private readonly _jobPostingRepository: IJobPostingRepository) {}

  async execute(jobId: string): Promise<boolean> {
    try {
      const job = await this._jobPostingRepository.findById(jobId);

      if (!job) {
        throw new AppError('Job not found', 404);
      }

      await this._jobPostingRepository.delete(jobId);

      return true;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to delete job', 500);
    }
  }
}
