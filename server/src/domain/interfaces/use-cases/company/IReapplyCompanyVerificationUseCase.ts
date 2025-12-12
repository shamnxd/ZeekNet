import { CompanyProfile } from 'src/domain/entities/company-profile.entity';
import { CompanyVerificationRequestDtoType } from 'src/application/dto/company/company-verification-request.dto';



export interface IReapplyCompanyVerificationUseCase {
  execute(data: CompanyVerificationRequestDtoType): Promise<CompanyProfile>;
}
