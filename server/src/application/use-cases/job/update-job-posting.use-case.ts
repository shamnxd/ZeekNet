import { injectable, inject } from 'inversify';
import { TYPES } from 'src/shared/constants/types';
import { IJobPostingRepository } from 'src/domain/interfaces/repositories/job/IJobPostingRepository';
import { UpdateCompanyJobPostingDto } from 'src/application/dtos/company/job/requests/update-company-job-posting.dto';
import { NotFoundError, InternalServerError, ValidationError, AuthorizationError } from 'src/domain/errors/errors';
import { JobPosting } from 'src/domain/entities/job-posting.entity';
import { IUpdateJobPostingUseCase } from 'src/domain/interfaces/use-cases/job/IUpdateJobPostingUseCase';
import { JobStatus } from 'src/domain/enums/job-status.enum';
import { IGetCompanyProfileByUserIdUseCase } from 'src/domain/interfaces/use-cases/company/profile/info/IGetCompanyProfileByUserIdUseCase';
import { JobPostingResponseDto } from 'src/application/dtos/admin/job/responses/job-posting-response.dto';
import { JobPostingMapper } from 'src/application/mappers/job/job-posting.mapper';
import { ERROR } from 'src/shared/constants/messages';


@injectable()
export class UpdateJobPostingUseCase implements IUpdateJobPostingUseCase {
  constructor(
    @inject(TYPES.JobPostingRepository) private readonly _jobPostingRepository: IJobPostingRepository,
    @inject(TYPES.GetCompanyProfileByUserIdUseCase) private readonly _getCompanyProfileByUserIdUseCase: IGetCompanyProfileByUserIdUseCase,
  ) { }

  async execute(dto: UpdateCompanyJobPostingDto): Promise<JobPostingResponseDto> {
    const { jobId, userId, ...updates } = dto;

    const companyProfile = await this._getCompanyProfileByUserIdUseCase.execute(userId);
    if (!companyProfile) {
      throw new NotFoundError(ERROR.NOT_FOUND('Company profile'));
    }

    const existingJob = await this._jobPostingRepository.findById(jobId);

    if (!existingJob) {
      throw new NotFoundError(ERROR.NOT_FOUND('Job posting'));
    }

    // Authorization Check
    if (existingJob.companyId !== companyProfile.id) {
      throw new AuthorizationError('Unauthorized to update this job posting');
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
      throw new InternalServerError(ERROR.FAILED_TO('update job posting'));
    }

    return JobPostingMapper.toResponse(updatedJob);
  }
}
