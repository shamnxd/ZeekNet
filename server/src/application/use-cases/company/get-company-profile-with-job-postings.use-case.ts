import { IGetCompanyProfileUseCase, IGetCompanyJobPostingsUseCase, IGetCompanyProfileWithJobPostingsUseCase } from '../../../domain/interfaces/use-cases/ICompanyUseCases';
import { JobPosting } from '../../../domain/entities/job-posting.entity';
import { CompanyProfileWithDetailsResponseDto } from '../../dto/company/company-response.dto';
import { CompanyProfileMapper } from '../../mappers/company-profile.mapper';
import { AppError } from '../../../domain/errors/errors';

export class GetCompanyProfileWithJobPostingsUseCase implements IGetCompanyProfileWithJobPostingsUseCase {
  constructor(
    private readonly _getCompanyProfileUseCase: IGetCompanyProfileUseCase,
    private readonly _getCompanyJobPostingsUseCase: IGetCompanyJobPostingsUseCase,
  ) {}

  async execute(userId: string): Promise<CompanyProfileWithDetailsResponseDto> {
    const companyProfile = await this._getCompanyProfileUseCase.execute(userId);

    if (!companyProfile) {
      throw new AppError('Company profile not found', 404);
    }

    // Business logic: Get recent active job postings for profile display
    const jobPostingsQuery = {
      page: 1,
      limit: 3,
      is_active: true,
      category_ids: undefined,
      employment_types: undefined,
      salary_min: undefined,
      salary_max: undefined,
      location: undefined,
      search: undefined,
    };

    const jobPostings = await this._getCompanyJobPostingsUseCase.execute(userId, jobPostingsQuery);

    // Convert minimal summary jobs into JobPosting entities (fill missing fields with defaults)
    const jobEntities: JobPosting[] = jobPostings.jobs.map(j => JobPosting.create({
      id: j.id,
      companyId: companyProfile.profile.id,
      title: j.title,
      description: '',
      responsibilities: [],
      qualifications: [],
      niceToHaves: [],
      benefits: [],
      salary: { min: 0, max: 0 },
      employmentTypes: j.employmentTypes || [],
      location: '',
      skillsRequired: [],
      categoryIds: [],
      isActive: j.isActive,
      viewCount: j.viewCount,
      applicationCount: j.applicationCount,
      createdAt: j.createdAt,
      updatedAt: j.createdAt,
      adminBlocked: j.adminBlocked,
      unpublishReason: j.unpublishReason,
      companyName: companyProfile.profile.companyName,
      companyLogo: companyProfile.profile.logo,
    }));

    // Aggregate and map to DTO
    const responseData = CompanyProfileMapper.toDetailedResponse({
      ...companyProfile,
      jobPostings: jobEntities,
    });

    return responseData;
  }
}

