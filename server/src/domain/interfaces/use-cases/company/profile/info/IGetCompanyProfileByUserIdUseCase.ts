import { CompanyProfile } from 'src/domain/entities/company-profile.entity';


export interface IGetCompanyProfileByUserIdUseCase {
  execute(userId: string): Promise<CompanyProfile | null>;
}
