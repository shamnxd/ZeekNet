import { IJobPostingRepository } from 'src/domain/interfaces/repositories/job/IJobPostingRepository';
import { IIncrementJobViewCountUseCase } from 'src/domain/interfaces/use-cases/job/IIncrementJobViewCountUseCase';

export class IncrementJobViewCountUseCase implements IIncrementJobViewCountUseCase {
  constructor(private readonly _jobPostingRepository: IJobPostingRepository) {}

  async execute(id: string, userRole?: string): Promise<void> {
    if (userRole === 'seeker') {
      const job = await this._jobPostingRepository.findById(id);
      if (job) {
        await this._jobPostingRepository.update(id, { viewCount: job.viewCount + 1 });
      }
    }
  }
}


