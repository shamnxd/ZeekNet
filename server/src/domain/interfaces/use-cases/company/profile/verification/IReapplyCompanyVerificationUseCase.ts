import { CompanyProfileResponseDto } from 'src/application/dtos/company/profile/info/responses/company-response.dto';
import { ReapplyVerificationRequestDto } from 'src/application/dtos/company/profile/verification/requests/reapply-verification-request.dto';

export interface IReapplyCompanyVerificationUseCase {
  execute(data: ReapplyVerificationRequestDto): Promise<CompanyProfileResponseDto>;
}
