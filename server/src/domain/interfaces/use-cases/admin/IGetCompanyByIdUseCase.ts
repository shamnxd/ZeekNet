import { CompanyWithVerificationResult } from 'src/application/dto/company/company-with-verification-result.dto';


export interface IGetCompanyByIdUseCase {
  execute(companyId: string): Promise<CompanyWithVerificationResult>;
}
