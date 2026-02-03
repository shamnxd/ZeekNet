import { ICompanyProfileRepository } from 'src/domain/interfaces/repositories/company/ICompanyProfileRepository';
import { ICompanyVerificationRepository } from 'src/domain/interfaces/repositories/company/ICompanyVerificationRepository';
import { IGetCompaniesWithVerificationUseCase } from 'src/domain/interfaces/use-cases/admin/companies/IGetCompaniesWithVerificationUseCase';
import { GetCompaniesQueryDto } from 'src/application/dtos/admin/companies/requests/get-companies-query.dto';
import { PaginatedCompaniesWithVerificationResultDto } from 'src/application/dtos/admin/companies/responses/paginated-companies-with-verification-result.dto';
import { IS3Service } from 'src/domain/interfaces/services/IS3Service';
import { CompanyProfile } from 'src/domain/entities/company-profile.entity';
import { CompanyProfileMapper } from 'src/application/mappers/company/profile/company-profile.mapper';

export class GetCompaniesWithVerificationUseCase implements IGetCompaniesWithVerificationUseCase {
  constructor(
    private readonly _companyProfileRepository: ICompanyProfileRepository,
    private readonly _companyVerificationRepository: ICompanyVerificationRepository,
    private readonly _s3Service: IS3Service,
  ) { }

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

        let logoUrl: string | undefined;
        if (company.logo && !company.logo.startsWith('http') && !company.logo.startsWith('/')) {
          logoUrl = await this._s3Service.getSignedUrl(company.logo);
        } else {
          logoUrl = company.logo;
        }

        return CompanyProfileMapper.toAdminListItemResponse(company, verification ? {
          taxId: verification.taxId,
          businessLicenseUrl: businessLicenseUrl || verification.businessLicenseUrl,
        } : null, logoUrl);
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


