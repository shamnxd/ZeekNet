import { VerifyCompanyRequestDto } from 'src/application/dtos/admin/companies/requests/verify-company-request.dto';

export interface IVerifyCompanyUseCase {
  execute(dto: VerifyCompanyRequestDto): Promise<void>;
}
