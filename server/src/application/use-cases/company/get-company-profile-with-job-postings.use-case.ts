import { IGetCompanyProfileUseCase, IGetCompanyJobPostingsUseCase, IGetCompanyProfileWithJobPostingsUseCase } from '../../../domain/interfaces/use-cases/ICompanyUseCases';
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

    // Aggregate and map to DTO
    const responseData = CompanyProfileMapper.toDetailedResponse({
      ...companyProfile,
      jobPostings: jobPostings.jobs,
    });

    return responseData;
  }
}

