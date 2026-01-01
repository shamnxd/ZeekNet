import { GetCompaniesQueryDto } from 'src/application/dtos/company/requests/get-companies-query.dto';
import { PaginatedCompaniesWithVerificationResultDto } from 'src/application/dtos/company/common/paginated-companies-with-verification-result.dto';

export interface IGetCompaniesWithVerificationUseCase {
  execute(options: GetCompaniesQueryDto): Promise<PaginatedCompaniesWithVerificationResultDto>;
}

