import { CreateCompanyProfileFromDtoRequestDto } from 'src/application/dtos/company/requests/create-company-profile-from-dto.dto';
import { CompanyProfile } from 'src/domain/entities/company-profile.entity';


export interface ICreateCompanyProfileFromDtoUseCase {
  execute(data: CreateCompanyProfileFromDtoRequestDto): Promise<CompanyProfile>;
}

