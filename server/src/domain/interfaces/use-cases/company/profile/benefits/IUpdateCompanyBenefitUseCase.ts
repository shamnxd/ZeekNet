import { CompanyBenefits } from 'src/domain/entities/company-benefits.entity';
import { UpdateCompanyBenefitsRequestDto } from 'src/application/dtos/company/profile/benefits/requests/company-benefits.dto';

export interface IUpdateCompanyBenefitUseCase {
  execute(data: UpdateCompanyBenefitsRequestDto): Promise<CompanyBenefits>;
}

