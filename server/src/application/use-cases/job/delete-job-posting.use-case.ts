import { injectable, inject } from 'inversify';
import { TYPES } from 'src/shared/constants/types';
import { IJobPostingRepository } from 'src/domain/interfaces/repositories/job/IJobPostingRepository';
import { ICompanyProfileRepository } from 'src/domain/interfaces/repositories/company/ICompanyProfileRepository';
import { AuthorizationError, InternalServerError, NotFoundError } from 'src/domain/errors/errors';
import { IDeleteJobPostingUseCase } from 'src/domain/interfaces/use-cases/job/IDeleteJobPostingUseCase';
import { DeleteCompanyJobPostingDto } from 'src/application/dtos/company/job/requests/delete-company-job-posting.dto';
import { ERROR } from 'src/shared/constants/messages';


@injectable()
export class DeleteJobPostingUseCase implements IDeleteJobPostingUseCase {
  constructor(
    @inject(TYPES.JobPostingRepository) private readonly _jobPostingRepository: IJobPostingRepository,
    @inject(TYPES.CompanyProfileRepository) private readonly _companyProfileRepository: ICompanyProfileRepository,
  ) { }

  async execute(dto: DeleteCompanyJobPostingDto): Promise<void> {
    const { jobId, userId } = dto;
    const companyProfile = await this._companyProfileRepository.findOne({ userId });

    if (!companyProfile) {
      throw new NotFoundError(ERROR.NOT_FOUND('Company profile'));
    }

    const existingJob = await this._jobPostingRepository.findById(jobId);

    if (!existingJob) {
      throw new NotFoundError(ERROR.NOT_FOUND('Job posting'));
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
      throw new InternalServerError(ERROR.FAILED_TO('delete job posting'));
    }
  }
}
