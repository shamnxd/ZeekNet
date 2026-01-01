import { IJobPostingRepository } from 'src/domain/interfaces/repositories/job/IJobPostingRepository';
import { UpdateJobPostingRequestDto } from 'src/application/dtos/admin/job/requests/update-job-posting-request.dto';
import { NotFoundError, InternalServerError, ValidationError } from 'src/domain/errors/errors';
import { JobPosting } from 'src/domain/entities/job-posting.entity';
import { IUpdateJobPostingUseCase } from 'src/domain/interfaces/use-cases/job/IUpdateJobPostingUseCase';
import { JobStatus } from 'src/domain/enums/job-status.enum';

export class UpdateJobPostingUseCase implements IUpdateJobPostingUseCase {
  constructor(private readonly _jobPostingRepository: IJobPostingRepository) {}

  async execute(data: UpdateJobPostingRequestDto & { jobId?: string }): Promise<JobPosting> {
    const { jobId, ...updates } = data;
    if (!jobId) throw new Error('Job ID is required');
    const existingJob = await this._jobPostingRepository.findById(jobId);

    if (!existingJob) {
      throw new NotFoundError('Job posting not found');
    }

    
    if (existingJob.status === JobStatus.CLOSED) {
      throw new ValidationError('Closed jobs cannot be edited. They remain permanently closed for consistency and audit safety.');
    }

    
    if (updates.total_vacancies !== undefined) {
      
      if (existingJob.status !== JobStatus.ACTIVE) {
        throw new ValidationError('Total vacancies can only be updated when the job is OPEN (active)');
      }

      
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



