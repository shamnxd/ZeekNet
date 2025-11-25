import { IJobPostingRepository } from '../../../domain/interfaces/repositories/job/IJobPostingRepository';
import { ICompanyProfileRepository } from '../../../domain/interfaces/repositories/company/ICompanyProfileRepository';
import { AppError } from '../../../domain/errors/errors';

export class DeleteJobPostingUseCase {
  constructor(
    private readonly _jobPostingRepository: IJobPostingRepository,
    private readonly _companyProfileRepository: ICompanyProfileRepository,
  ) {}

  async execute(id: string, userId: string): Promise<void> {
    const companyProfile = await this._companyProfileRepository.findOne({ userId });

    if (!companyProfile) {
      throw new AppError('Company profile not found', 404);
    }

    const existingJob = await this._jobPostingRepository.findById(id);

    if (!existingJob) {
      throw new AppError('Job posting not found', 404);
    }

    if (!existingJob.companyId || existingJob.companyId === '') {
      await this._jobPostingRepository.update(id, { companyId: companyProfile.id });
    } else if (existingJob.companyId !== companyProfile.id) {
      if (existingJob.companyId !== userId) {
        throw new AppError('Unauthorized to delete this job posting', 403);
      }
    }

    const deleted = await this._jobPostingRepository.delete(id);

    if (!deleted) {
      throw new AppError('Failed to delete job posting', 500);
    }
  }
}

