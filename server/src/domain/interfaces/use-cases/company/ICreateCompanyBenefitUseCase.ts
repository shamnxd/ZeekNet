import { CompanyBenefits } from 'src/domain/entities/company-benefits.entity';
import { CreateCompanyBenefitsRequestDto } from 'src/application/dto/company/company-benefits.dto';

export interface ICreateCompanyBenefitUseCase {
  execute(data: CreateCompanyBenefitsRequestDto): Promise<CompanyBenefits>;
}
