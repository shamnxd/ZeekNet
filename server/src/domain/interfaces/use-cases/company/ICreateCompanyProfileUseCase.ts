import { CompanyProfile } from 'src/domain/entities/company-profile.entity';
import { CreateCompanyProfileData } from './CreateCompanyProfileData';



export interface ICreateCompanyProfileUseCase {
  execute(data: CreateCompanyProfileData): Promise<CompanyProfile>;
}
