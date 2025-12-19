import { IJobPostingRepository } from '../../../domain/interfaces/repositories/job/IJobPostingRepository';
import { IAdminGetJobByIdUseCase } from 'src/domain/interfaces/use-cases/admin/IAdminGetJobByIdUseCase';
import { NotFoundError } from '../../../domain/errors/errors';
import { JobPosting } from '../../../domain/entities/job-posting.entity';

export class AdminGetJobByIdUseCase implements IAdminGetJobByIdUseCase {
  constructor(private readonly _jobPostingRepository: IJobPostingRepository) {}

  async execute(jobId: string): Promise<JobPosting> {
    const job = await this._jobPostingRepository.findById(jobId);

    if (!job) {
      throw new NotFoundError('Job not found');
    }

    return job;
  }
}
