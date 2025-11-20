import { IJobPostingRepository } from '../../../domain/interfaces/repositories/job/IJobPostingRepository';

export class IncrementJobViewCountUseCase {
  constructor(private readonly _jobPostingRepository: IJobPostingRepository) {}

  async execute(id: string, userRole?: string): Promise<void> {
    try {
      if (userRole === 'seeker') {
        const job = await this._jobPostingRepository.findById(id);
        if (job) {
          await this._jobPostingRepository.update(id, { view_count: job.view_count + 1 });
        }
      }
    } catch (error) {
      console.error('Failed to increment view count:', error);
    }
  }
}

