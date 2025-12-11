import { GetCompaniesQueryDto } from 'src/application/dto/company/get-companies-query.dto';
import { PaginatedCompaniesWithVerificationResultDto } from 'src/application/dto/company/paginated-companies-with-verification-result.dto';

export interface IGetCompaniesWithVerificationUseCase {
  execute(options: GetCompaniesQueryDto): Promise<PaginatedCompaniesWithVerificationResultDto>;
}
