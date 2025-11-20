import { ICompanyProfileRepository } from '../../../domain/interfaces/repositories/company/ICompanyProfileRepository';
import { CompanyQueryOptions, PaginatedCompanies, IGetAllCompaniesUseCase } from '../../../domain/interfaces/use-cases/IAdminUseCases';

export class GetAllCompaniesUseCase implements IGetAllCompaniesUseCase {
  constructor(private readonly _companyProfileRepository: ICompanyProfileRepository) {}

  async execute(options: CompanyQueryOptions): Promise<PaginatedCompanies> {
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

    return {
      companies: result.companies,
      total: result.total,
      page,
      limit,
      totalPages: Math.ceil(result.total / limit),
    };
  }
}
