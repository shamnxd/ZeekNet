import { GetCompaniesQueryDto } from 'src/application/dtos/admin/companies/requests/get-companies-query.dto';
import { PaginatedCompaniesWithVerificationResultDto } from 'src/application/dtos/admin/companies/responses/paginated-companies-with-verification-result.dto';

export interface IGetCompaniesWithVerificationUseCase {
  execute(options: GetCompaniesQueryDto): Promise<PaginatedCompaniesWithVerificationResultDto>;
}

