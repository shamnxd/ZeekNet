import { IGetAllCompaniesUseCase } from 'src/domain/interfaces/use-cases/admin/IGetAllCompaniesUseCase';
import { ICompanyProfileRepository } from '../../../domain/interfaces/repositories/company/ICompanyProfileRepository';
import { GetCompaniesQueryDto } from '../../dto/company/get-companies-query.dto';
import { PaginatedCompaniesResultDto } from '../../dto/company/paginated-companies-result.dto';

export class GetAllCompaniesUseCase implements IGetAllCompaniesUseCase {
  constructor(private readonly _companyProfileRepository: ICompanyProfileRepository) {}

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

    return {
      companies: result.companies,
      total: result.total,
      page,
      limit,
      totalPages: Math.ceil(result.total / limit),
    };
  }
}
