import { CompanyWithVerificationResult } from 'src/application/dtos/admin/companies/responses/company-with-verification-result.dto';


export interface IGetCompanyByIdUseCase {
  execute(companyId: string): Promise<CompanyWithVerificationResult>;
}

