import { IGetAllCompaniesUseCase } from 'src/domain/interfaces/use-cases/admin/companies/IGetAllCompaniesUseCase';
import { ICompanyProfileRepository } from 'src/domain/interfaces/repositories/company/ICompanyProfileRepository';
import { IS3Service } from 'src/domain/interfaces/services/IS3Service';
import { GetCompaniesQueryDto } from 'src/application/dtos/admin/companies/requests/get-companies-query.dto';
import { PaginatedCompaniesResultDto } from 'src/application/dtos/admin/companies/responses/paginated-companies-result.dto';

export class GetAllCompaniesUseCase implements IGetAllCompaniesUseCase {
  constructor(
    private readonly _companyProfileRepository: ICompanyProfileRepository,
    private readonly _s3Service: IS3Service,
  ) {}

  async execute(options: GetCompaniesQueryDto): Promise<PaginatedCompaniesResultDto> {
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

    const companiesWithSignedUrls = await Promise.all(
      result.companies.map(async (company) => {
        let logo = company.logo;
        if (logo && !logo.startsWith('http')) {
          logo = await this._s3Service.getSignedUrl(logo);
        }
        return { ...company, logo };
      }),
    );

    return {
      companies: companiesWithSignedUrls,
      total: result.total,
      page,
      limit,
      totalPages: Math.ceil(result.total / limit),
    };
  }
}

