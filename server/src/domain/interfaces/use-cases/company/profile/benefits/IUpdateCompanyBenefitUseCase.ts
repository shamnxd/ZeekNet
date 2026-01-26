import { CompanyBenefitResponseDto } from 'src/application/dtos/company/profile/benefits/responses/company-benefit-response.dto';
import { UpdateCompanyBenefitsRequestDto } from 'src/application/dtos/company/profile/benefits/requests/company-benefits.dto';

export interface IUpdateCompanyBenefitUseCase {
  execute(data: UpdateCompanyBenefitsRequestDto): Promise<CompanyBenefitResponseDto>;
}

