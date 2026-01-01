import { GetCompaniesQueryDto } from 'src/application/dtos/admin/companies/requests/get-companies-query.dto';
import { PaginatedCompaniesResultDto } from 'src/application/dtos/admin/companies/responses/paginated-companies-result.dto';

export interface IGetAllCompaniesUseCase {
  execute(options: GetCompaniesQueryDto): Promise<PaginatedCompaniesResultDto>;
}

