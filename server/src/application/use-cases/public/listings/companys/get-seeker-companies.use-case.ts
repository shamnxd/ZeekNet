import { injectable, inject } from 'inversify';
import { TYPES } from 'src/shared/constants/types';
import { IGetSeekerCompaniesUseCase } from 'src/domain/interfaces/use-cases/public/listings/companys/IGetSeekerCompaniesUseCase';
import { ICompanyProfileRepository } from 'src/domain/interfaces/repositories/company/ICompanyProfileRepository';
import { IJobPostingRepository } from 'src/domain/interfaces/repositories/job/IJobPostingRepository';
import { ICompanySubscriptionRepository } from 'src/domain/interfaces/repositories/subscription/ICompanySubscriptionRepository';
import { IS3Service } from 'src/domain/interfaces/services/IS3Service';
import { CompanyVerificationStatus } from 'src/domain/enums/verification-status.enum';

@injectable()
export class GetSeekerCompaniesUseCase implements IGetSeekerCompaniesUseCase {
  constructor(
    @inject(TYPES.CompanyProfileRepository) private readonly _companyProfileRepository: ICompanyProfileRepository,
    @inject(TYPES.JobPostingRepository) private readonly _jobPostingRepository: IJobPostingRepository,
    @inject(TYPES.CompanySubscriptionRepository) private readonly _subscriptionRepository: ICompanySubscriptionRepository,
    @inject(TYPES.S3Service) private readonly _s3Service: IS3Service,
  ) {}


  async execute(options: {
    page?: number;
    limit?: number;
    search?: string;
    industry?: string;
  }): Promise<{
    companies: Array<{
      id: string;
      companyName: string;
      logo: string;
      industry: string;
      aboutUs: string;
      activeJobCount: number;
      hasActiveSubscription: boolean;
    }>;
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const page = options.page || 1;
    const limit = options.limit || 12;

    const result = await this._companyProfileRepository.getAllCompanies({
      page,
      limit,
      search: options.search,
      industry: options.industry,
      isVerified: CompanyVerificationStatus.VERIFIED,
      isBlocked: false,
      sortBy: 'activeJobCount',
      sortOrder: 'desc',
    });

    const companiesWithDetails = await Promise.all(
      result.companies.map(async (company) => {
        const activeJobs = await this._jobPostingRepository.countActiveJobsByCompany(company.id);
        
        const subscription = await this._subscriptionRepository.findActiveByCompanyId(company.id);
        const hasActiveSubscription = !!subscription && !subscription.isDefault;

        let logo = company.logo;
        if (logo && !logo.startsWith('http')) {
          logo = await this._s3Service.getSignedUrl(logo);
        }

        return {
          id: company.id,
          companyName: company.companyName,
          logo,
          industry: company.industry,
          aboutUs: company.aboutUs,
          activeJobCount: activeJobs,
          hasActiveSubscription,
        };
      }),
    );

    return {
      companies: companiesWithDetails,
      total: result.total,
      page,
      limit,
      totalPages: Math.ceil(result.total / limit),
    };
  }
}
