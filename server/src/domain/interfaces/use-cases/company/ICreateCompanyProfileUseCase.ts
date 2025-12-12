import { CompanyProfile } from 'src/domain/entities/company-profile.entity';
import { CreateCompanyProfileRequestDtoType } from 'src/application/dto/company/create-company-profile-request.dto';



export interface ICreateCompanyProfileUseCase {
  execute(data: CreateCompanyProfileRequestDtoType): Promise<CompanyProfile>;
}
