import { ICompanyProfileRepository } from '../../../domain/interfaces/repositories/company/ICompanyProfileRepository';
import { ICompanyVerificationRepository } from '../../../domain/interfaces/repositories/company/ICompanyVerificationRepository';
import { IGetCompaniesWithVerificationUseCase } from 'src/domain/interfaces/use-cases/admin/IGetCompaniesWithVerificationUseCase';
import { GetCompaniesQueryDto } from '../../dto/company/get-companies-query.dto';
import { PaginatedCompaniesWithVerificationResultDto } from '../../dto/company/paginated-companies-with-verification-result.dto';
import { IS3Service } from '../../../domain/interfaces/services/IS3Service';
import { CompanyProfile } from '../../../domain/entities/company-profile.entity';

export class GetCompaniesWithVerificationUseCase implements IGetCompaniesWithVerificationUseCase {
  constructor(
    private readonly _companyProfileRepository: ICompanyProfileRepository,
    private readonly _companyVerificationRepository: ICompanyVerificationRepository,
    private readonly _s3Service: IS3Service,
  ) {}

  async execute(options: GetCompaniesQueryDto): Promise<PaginatedCompaniesWithVerificationResultDto> {
    const page = options.page || 1;
    const limit = options.limit || 10;

    const convertedOptions = {
      page,
      limit,
      search: options.search,
      isVerified: options.isVerified,
      isBlocked: options.isBlocked,
      sortBy: options.sortBy as 'createdAt' | 'companyName' | 'employeeCount' | undefined,
      sortOrder: options.sortOrder,
    };

    const result = await this._companyProfileRepository.getAllCompanies(convertedOptions);

    const companiesWithVerification = await Promise.all(
      result.companies.map(async (company: CompanyProfile) => {
        const verification = await this._companyVerificationRepository.findOne({ companyId: company.id });

        let businessLicenseUrl: string | undefined;
        if (verification?.businessLicenseUrl) {
          const key = this._s3Service.extractKeyFromUrl(verification.businessLicenseUrl);
          businessLicenseUrl = await this._s3Service.getSignedUrl(key);
        }

        return {
          id: company.id,
          userId: company.userId,
          companyName: company.companyName,
          logo: company.logo,
          websiteLink: company.websiteLink,
          employeeCount: company.employeeCount,
          industry: company.industry,
          organisation: company.organisation,
          aboutUs: company.aboutUs,
          isVerified: company.isVerified,
          isBlocked: company.isBlocked,
          email: company.email,
          createdAt: company.createdAt.toISOString(),
          updatedAt: company.updatedAt.toISOString(),
          ...(verification && {
            verification: {
              taxId: verification.taxId,
              businessLicenseUrl: businessLicenseUrl || verification.businessLicenseUrl,
            },
          }),
        };
      }),
    );

    return {
      companies: companiesWithVerification,
      total: result.total,
      page,
      limit,
      totalPages: Math.ceil(result.total / limit),
    };
  }
}
