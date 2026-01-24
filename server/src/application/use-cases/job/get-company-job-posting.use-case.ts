import { IJobPostingRepository } from 'src/domain/interfaces/repositories/job/IJobPostingRepository';
import { NotFoundError } from 'src/domain/errors/errors';
import { JobPosting } from 'src/domain/entities/job-posting.entity';
import { IGetCompanyJobPostingUseCase } from 'src/domain/interfaces/use-cases/job/IGetCompanyJobPostingUseCase';
import { GetCompanyJobPostingDto } from 'src/application/dtos/company/job/requests/get-company-job-posting.dto';
import { IGetCompanyProfileByUserIdUseCase } from 'src/domain/interfaces/use-cases/company/profile/info/IGetCompanyProfileByUserIdUseCase';
import { JobPostingResponseDto } from 'src/application/dtos/admin/job/responses/job-posting-response.dto';
import { JobPostingMapper } from 'src/application/mappers/job/job-posting.mapper';

export class GetCompanyJobPostingUseCase implements IGetCompanyJobPostingUseCase {
  constructor(
    private readonly _jobPostingRepository: IJobPostingRepository,
    private readonly _getCompanyProfileByUserIdUseCase: IGetCompanyProfileByUserIdUseCase
  ) { }

  async execute(dto: GetCompanyJobPostingDto): Promise<JobPostingResponseDto> {
    const { jobId, userId } = dto;
    const companyProfile = await this._getCompanyProfileByUserIdUseCase.execute(userId);
    if (!companyProfile) throw new NotFoundError('Company profile not found');

    const jobPosting = await this._jobPostingRepository.findById(jobId);

    if (!jobPosting) {
      throw new NotFoundError('Job posting not found');
    }

    if (jobPosting.companyId !== companyProfile.id) {
      // If blocked but belongs to company, maybe show it? Current logic says if blocked throw not found if mismatch?
      // Original logic was: if (jobPosting.companyId !== companyId) { if (status=blocked) throw ... }
      // This implies if ID mismatch, it checks blocked? This is confusing.
      // Usually: if mismatch -> Unauthorized or NotFound.
      // But if user viewing their OWN job, they must own it.

      throw new NotFoundError('Job posting not found');
    }

    return JobPostingMapper.toResponse(jobPosting);
  }
}
