import { CompanyBenefits } from 'src/domain/entities/company-benefits.entity';
import { UpdateCompanyBenefitsRequestDto } from 'src/application/dto/company/company-benefits.dto';

export interface IUpdateCompanyBenefitUseCase {
  execute(data: UpdateCompanyBenefitsRequestDto): Promise<CompanyBenefits>;
}
