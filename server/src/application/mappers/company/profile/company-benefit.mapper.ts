import { CompanyBenefits } from 'src/domain/entities/company-benefits.entity';
import { CompanyBenefitResponseDto } from 'src/application/dtos/company/profile/benefits/responses/company-benefit-response.dto';

export class CompanyBenefitMapper {
  static toResponse(benefit: CompanyBenefits): CompanyBenefitResponseDto {
    return {
      id: benefit.id,
      perk: benefit.perk,
      description: benefit.description || '',
      createdAt: benefit.createdAt,
      updatedAt: benefit.updatedAt,
    };
  }

  static toResponseList(benefits: CompanyBenefits[]): CompanyBenefitResponseDto[] {
    return benefits.map((benefit) => this.toResponse(benefit));
  }
}


