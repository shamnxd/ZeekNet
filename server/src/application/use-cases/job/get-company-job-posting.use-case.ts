import { IJobPostingRepository } from 'src/domain/interfaces/repositories/job/IJobPostingRepository';
import { NotFoundError } from 'src/domain/errors/errors';
import { IGetCompanyJobPostingUseCase } from 'src/domain/interfaces/use-cases/job/IGetCompanyJobPostingUseCase';
import { GetCompanyJobPostingDto } from 'src/application/dtos/company/job/requests/get-company-job-posting.dto';
import { IGetCompanyProfileByUserIdUseCase } from 'src/domain/interfaces/use-cases/company/profile/info/IGetCompanyProfileByUserIdUseCase';
import { JobPostingResponseDto } from 'src/application/dtos/admin/job/responses/job-posting-response.dto';
import { JobPostingMapper } from 'src/application/mappers/job/job-posting.mapper';

export class GetCompanyJobPostingUseCase implements IGetCompanyJobPostingUseCase {
  constructor(
    private readonly _jobPostingRepository: IJobPostingRepository,
    private readonly _getCompanyProfileByUserIdUseCase: IGetCompanyProfileByUserIdUseCase,
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
      throw new NotFoundError('Job posting not found');
    }

    return JobPostingMapper.toResponse(jobPosting);
  }
}
