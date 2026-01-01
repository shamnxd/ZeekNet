import { IJobPostingRepository } from 'src/domain/interfaces/repositories/job/IJobPostingRepository';
import { IAdminDeleteJobUseCase } from 'src/domain/interfaces/use-cases/admin/job/IAdminDeleteJobUseCase';
import { NotFoundError } from 'src/domain/errors/errors';

export class AdminDeleteJobUseCase implements IAdminDeleteJobUseCase {
  constructor(private readonly _jobPostingRepository: IJobPostingRepository) {}

  async execute(jobId: string): Promise<boolean> {
    const job = await this._jobPostingRepository.findById(jobId);

    if (!job) {
      throw new NotFoundError('Job not found');
    }

    await this._jobPostingRepository.delete(jobId);

    return true;
  }
}
