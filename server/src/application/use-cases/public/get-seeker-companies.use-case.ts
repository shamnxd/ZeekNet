import { IGetSeekerCompaniesUseCase } from '../../../domain/interfaces/use-cases/public/IGetSeekerCompaniesUseCase';
import { ICompanyProfileRepository } from '../../../domain/interfaces/repositories/company/ICompanyProfileRepository';
import { IJobPostingRepository } from '../../../domain/interfaces/repositories/job/IJobPostingRepository';
import { ICompanySubscriptionRepository } from '../../../domain/interfaces/repositories/subscription/ICompanySubscriptionRepository';
import { IS3Service } from '../../../domain/interfaces/services/IS3Service';
import { CompanyVerificationStatus } from '../../../domain/enums/verification-status.enum';


export class GetSeekerCompaniesUseCase implements IGetSeekerCompaniesUseCase {
  constructor(
    private readonly _companyProfileRepository: ICompanyProfileRepository,
    private readonly _jobPostingRepository: IJobPostingRepository,
    private readonly _subscriptionRepository: ICompanySubscriptionRepository,
    private readonly _s3Service: IS3Service,
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
