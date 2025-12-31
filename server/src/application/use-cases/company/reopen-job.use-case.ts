import { IJobPostingRepository } from '../../../domain/interfaces/repositories/job/IJobPostingRepository';
import { ICompanyProfileRepository } from '../../../domain/interfaces/repositories/company/ICompanyProfileRepository';
import { NotFoundError, ValidationError } from '../../../domain/errors/errors';
import { JobStatus } from '../../../domain/enums/job-status.enum';
import { JobClosureType } from '../../../domain/enums/job-closure-type.enum';

export interface ReopenJobDto {
  userId: string;
  jobId: string;
  additionalVacancies: number;
}

export class ReopenJobUseCase {
  constructor(
    private readonly _jobPostingRepository: IJobPostingRepository,
    private readonly _companyProfileRepository: ICompanyProfileRepository,
  ) {}

  async execute(dto: ReopenJobDto): Promise<void> {
    const { userId, jobId, additionalVacancies } = dto;

    // Validate additional vacancies
    if (additionalVacancies < 1) {
      throw new ValidationError('Additional vacancies must be at least 1');
    }

    const companyProfile = await this._companyProfileRepository.findOne({ userId });
    if (!companyProfile) {
      throw new NotFoundError('Company profile not found');
    }

    const job = await this._jobPostingRepository.findById(jobId);
    if (!job) {
      throw new NotFoundError('Job posting not found');
    }

    if (job.companyId !== companyProfile.id) {
      throw new ValidationError('You can only reopen your own job postings');
    }

    // Only allow reopening auto-closed jobs
    if (job.status !== JobStatus.CLOSED) {
      throw new ValidationError('Only closed jobs can be reopened');
    }

    if (job.closureType !== JobClosureType.AUTO_FILLED) {
      throw new ValidationError('Only auto-closed jobs (filled vacancies) can be reopened. Manually closed jobs cannot be reopened.');
    }

    // Calculate new total vacancies
    const currentTotal = job.totalVacancies ?? 0;
    const currentFilled = job.filledVacancies ?? 0;
    const newTotalVacancies = currentTotal + additionalVacancies;

    // Ensure new total is not less than filled vacancies
    if (newTotalVacancies < currentFilled) {
      throw new ValidationError(`New total vacancies (${newTotalVacancies}) cannot be less than filled vacancies (${currentFilled})`);
    }

    // Reopen the job: set status to ACTIVE, update totalVacancies, clear closure fields
    await this._jobPostingRepository.update(jobId, {
      status: JobStatus.ACTIVE,
      totalVacancies: newTotalVacancies,
      closureType: undefined,
      closedAt: undefined,
    });
  }
}



