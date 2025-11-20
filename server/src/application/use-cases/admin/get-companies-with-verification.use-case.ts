import { ICompanyProfileRepository } from '../../../domain/interfaces/repositories/company/ICompanyProfileRepository';
import { ICompanyVerificationRepository } from '../../../domain/interfaces/repositories/company/ICompanyVerificationRepository';
import { CompanyQueryOptions, PaginatedCompaniesWithVerification, IGetCompaniesWithVerificationUseCase } from '../../../domain/interfaces/use-cases/IAdminUseCases';
import { IS3Service } from '../../../domain/interfaces/services/IS3Service';
import { CompanyProfile } from '../../../domain/entities/company-profile.entity';

export class GetCompaniesWithVerificationUseCase implements IGetCompaniesWithVerificationUseCase {
  constructor(
    private readonly _companyProfileRepository: ICompanyProfileRepository,
    private readonly _companyVerificationRepository: ICompanyVerificationRepository,
    private readonly _s3Service: IS3Service,
  ) {}

  async execute(options: CompanyQueryOptions): Promise<PaginatedCompaniesWithVerification> {
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

        const companyData = company.toJSON();

        let businessLicenseUrl: string | undefined;
        if (verification?.businessLicenseUrl) {
          try {
            const key = this._s3Service.extractKeyFromUrl(verification.businessLicenseUrl);
            businessLicenseUrl = await this._s3Service.getSignedUrl(key);
          } catch (error) {
            console.error('Failed to generate signed URL for business license:', error);
            businessLicenseUrl = verification.businessLicenseUrl;
          }
        }

        return {
          id: companyData.id as string,
          userId: companyData.userId as string,
          companyName: companyData.companyName as string,
          logo: companyData.logo as string,
          websiteLink: companyData.websiteLink as string,
          employeeCount: companyData.employeeCount as number,
          industry: companyData.industry as string,
          organisation: companyData.organisation as string,
          aboutUs: companyData.aboutUs as string,
          isVerified: companyData.isVerified as 'pending' | 'rejected' | 'verified',
          isBlocked: (companyData.userIsBlocked as boolean) ?? false,
          createdAt: companyData.createdAt as string,
          updatedAt: companyData.updatedAt as string,
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
