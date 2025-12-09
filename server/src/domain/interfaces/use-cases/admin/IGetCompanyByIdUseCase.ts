import { CompanyWithVerification } from '../company/CompanyWithVerification';


export interface IGetCompanyByIdUseCase {
  execute(companyId: string): Promise<CompanyWithVerification>;
}
