import { CompanyBenefitResponseDto } from 'src/application/dtos/company/profile/benefits/responses/company-benefit-response.dto';
import { GetCompanyBenefitsRequestDto } from 'src/application/dtos/company/profile/benefits/requests/company-benefits.dto';

export interface IGetCompanyBenefitUseCase {
  execute(dto: GetCompanyBenefitsRequestDto): Promise<CompanyBenefitResponseDto[]>;
}
