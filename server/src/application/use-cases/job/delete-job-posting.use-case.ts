import { IJobPostingRepository } from 'src/domain/interfaces/repositories/job/IJobPostingRepository';
import { ICompanyProfileRepository } from 'src/domain/interfaces/repositories/company/ICompanyProfileRepository';
import { AuthorizationError, InternalServerError, NotFoundError } from 'src/domain/errors/errors';
import { IDeleteJobPostingUseCase } from 'src/domain/interfaces/use-cases/job/IDeleteJobPostingUseCase';
import { DeleteCompanyJobPostingDto } from 'src/application/dtos/company/job/requests/delete-company-job-posting.dto';

export class DeleteJobPostingUseCase implements IDeleteJobPostingUseCase {
  constructor(
    private readonly _jobPostingRepository: IJobPostingRepository,
    private readonly _companyProfileRepository: ICompanyProfileRepository,
  ) { }

  async execute(dto: DeleteCompanyJobPostingDto): Promise<void> {
    const { jobId, userId } = dto;
    const companyProfile = await this._companyProfileRepository.findOne({ userId });

    if (!companyProfile) {
      throw new NotFoundError('Company profile not found');
    }

    const existingJob = await this._jobPostingRepository.findById(jobId);

    if (!existingJob) {
      throw new NotFoundError('Job posting not found');
    }

    if (!existingJob.companyId || existingJob.companyId === '') {
      await this._jobPostingRepository.update(jobId, { companyId: companyProfile.id });
    } else if (existingJob.companyId !== companyProfile.id) {
      if (existingJob.companyId !== userId) {
        throw new AuthorizationError('Unauthorized to delete this job posting');
      }
    }

    const deleted = await this._jobPostingRepository.delete(jobId);

    if (!deleted) {
      throw new InternalServerError('Failed to delete job posting');
    }
  }
}
