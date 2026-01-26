import { IJobPostingRepository } from 'src/domain/interfaces/repositories/job/IJobPostingRepository';
import { NotFoundError } from 'src/domain/errors/errors';
import { IGetCompanyJobPostingUseCase } from 'src/domain/interfaces/use-cases/job/IGetCompanyJobPostingUseCase';
import { GetCompanyJobPostingDto } from 'src/application/dtos/company/job/requests/get-company-job-posting.dto';
import { IGetCompanyProfileByUserIdUseCase } from 'src/domain/interfaces/use-cases/company/profile/info/IGetCompanyProfileByUserIdUseCase';
import { JobPostingResponseDto } from 'src/application/dtos/admin/job/responses/job-posting-response.dto';
import { JobPostingMapper } from 'src/application/mappers/job/job-posting.mapper';
import { IIncrementJobViewCountUseCase } from 'src/domain/interfaces/use-cases/job/IIncrementJobViewCountUseCase';

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

    // Increment view count internally
    // Note: Usually viewing your own job shouldn't increment view count, but the original logic
    // was calling it with userRole. The increments logic checks if role === 'seeker'.
    // Here we don't have userRole in DTO but the original code passed req.user?.role.
    // If the viewer is the company owner (which is enforced above), role is likely 'company'.
    // The increment logic only increments if role is 'seeker'.
    // So actually, for "GetCompanyJobPosting", we probably DON'T need to increment view count at all?
    // Let's check the original controller logic again.

    // Original controller:
    // const userRole = req.user?.role || '';
    // this._incrementJobViewCountUseCase.execute({ id: parsed.data.id, userRole }).catch(console.error);

    // If this endpoint is strictly for the COMPANY to view their OWN job, then the userRole
    // will be 'company' (or authorized user).
    // The IncrementJobViewCountUseCase only works if userRole === 'seeker'.
    // So effectively, this call in the controller was doing NOTHING for company users.

    // Therefore, I can just REMOVE the call from the controller without moving it here, 
    // because a company viewing their own job should not count as a view.

    return JobPostingMapper.toResponse(jobPosting);
  }
}
