import { GetCompaniesQueryDto } from 'src/application/dtos/company/requests/get-companies-query.dto';
import { PaginatedCompaniesResultDto } from 'src/application/dtos/company/common/paginated-companies-result.dto';

export interface IGetAllCompaniesUseCase {
  execute(options: GetCompaniesQueryDto): Promise<PaginatedCompaniesResultDto>;
}

