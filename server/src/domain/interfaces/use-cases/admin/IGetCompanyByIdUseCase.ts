import { CompanyWithVerificationResult } from 'src/application/dtos/company/common/company-with-verification-result.dto';


export interface IGetCompanyByIdUseCase {
  execute(companyId: string): Promise<CompanyWithVerificationResult>;
}

