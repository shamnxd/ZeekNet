import { PaginatedCompaniesWithVerification } from '../company/PaginatedCompaniesWithVerification';


export interface IGetPendingCompaniesUseCase {
  execute(): Promise<PaginatedCompaniesWithVerification>;
}
