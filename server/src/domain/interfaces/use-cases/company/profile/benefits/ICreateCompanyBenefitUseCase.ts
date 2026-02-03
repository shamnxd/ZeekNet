import { CompanyBenefitResponseDto } from 'src/application/dtos/company/profile/benefits/responses/company-benefit-response.dto';
import { CreateCompanyBenefitsRequestDto } from 'src/application/dtos/company/profile/benefits/requests/company-benefits.dto';

export interface ICreateCompanyBenefitUseCase {
  execute(data: CreateCompanyBenefitsRequestDto): Promise<CompanyBenefitResponseDto>;
}

