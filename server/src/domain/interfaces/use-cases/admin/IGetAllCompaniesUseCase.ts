import { GetCompaniesQueryDto } from 'src/application/dto/company/get-companies-query.dto';
import { PaginatedCompaniesResultDto } from 'src/application/dto/company/paginated-companies-result.dto';

export interface IGetAllCompaniesUseCase {
  execute(options: GetCompaniesQueryDto): Promise<PaginatedCompaniesResultDto>;
}
