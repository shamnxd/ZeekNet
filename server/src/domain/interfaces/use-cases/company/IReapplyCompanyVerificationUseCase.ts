import { CompanyProfile } from 'src/domain/entities/company-profile.entity';
import { CompanyVerificationData } from './CompanyVerificationData';



export interface IReapplyCompanyVerificationUseCase {
  execute(data: CompanyVerificationData): Promise<CompanyProfile>;
}
