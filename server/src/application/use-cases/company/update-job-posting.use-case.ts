import { IJobPostingRepository } from '../../../domain/interfaces/repositories/job/IJobPostingRepository';
import { UpdateJobPostingRequestDto } from '../../dto/job-posting/update-job-posting-request.dto';
import { NotFoundError, InternalServerError, ValidationError } from '../../../domain/errors/errors';
import { JobPosting } from '../../../domain/entities/job-posting.entity';
import { IUpdateJobPostingUseCase } from 'src/domain/interfaces/use-cases/jobs/IUpdateJobPostingUseCase';
import { JobStatus } from '../../../domain/enums/job-status.enum';

export class UpdateJobPostingUseCase implements IUpdateJobPostingUseCase {
  constructor(private readonly _jobPostingRepository: IJobPostingRepository) {}

  async execute(data: UpdateJobPostingRequestDto & { jobId?: string }): Promise<JobPosting> {
    const { jobId, ...updates } = data;
    if (!jobId) throw new Error('Job ID is required');
    const existingJob = await this._jobPostingRepository.findById(jobId);

    if (!existingJob) {
      throw new NotFoundError('Job posting not found');
    }

    // Validate totalVacancies update
    if (updates.total_vacancies !== undefined) {
      // Only allow updating totalVacancies when job is ACTIVE (OPEN)
      if (existingJob.status !== JobStatus.ACTIVE) {
        throw new ValidationError('Total vacancies can only be updated when the job is OPEN (active)');
      }

      // Validate that totalVacancies >= filledVacancies
      const filledVacancies = existingJob.filledVacancies ?? 0;
      if (updates.total_vacancies < filledVacancies) {
        throw new ValidationError(`Total vacancies (${updates.total_vacancies}) cannot be less than filled vacancies (${filledVacancies})`);
      }
    }

    const updatedJob = await this._jobPostingRepository.update(jobId, updates);

    if (!updatedJob) {
      throw new InternalServerError('Failed to update job posting');
    }

    return updatedJob;
  }
}

