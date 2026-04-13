import { IJobPostingRepository } from 'src/domain/interfaces/repositories/job/IJobPostingRepository';
import { IAdminDeleteJobUseCase } from 'src/domain/interfaces/use-cases/admin/job/IAdminDeleteJobUseCase';
import { NotFoundError } from 'src/domain/errors/errors';
import { injectable, inject } from 'inversify';
import { TYPES } from 'src/shared/constants/types';
import { ERROR } from 'src/shared/constants/messages';

@injectable()
export class AdminDeleteJobUseCase implements IAdminDeleteJobUseCase {
  constructor(@inject(TYPES.JobPostingRepository) private readonly _jobPostingRepository: IJobPostingRepository) {}

  async execute(jobId: string): Promise<boolean> {
    const job = await this._jobPostingRepository.findById(jobId);

    if (!job) {
      throw new NotFoundError(ERROR.NOT_FOUND('Job'));
    }

    await this._jobPostingRepository.delete(jobId);

    return true;
  }
}
