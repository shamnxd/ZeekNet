import { DeleteCompanyBenefitsRequestDto } from 'src/application/dtos/company/profile/benefits/requests/company-benefits.dto';

export interface IDeleteCompanyBenefitUseCase {
  execute(dto: DeleteCompanyBenefitsRequestDto): Promise<void>;
}
