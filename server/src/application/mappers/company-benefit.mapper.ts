import { CompanyBenefits } from '../../domain/entities/company-benefits.entity';

export class CompanyBenefitMapper {
  static toResponse(benefit: CompanyBenefits): { id: string; perk: string; description: string } {
    return {
      id: benefit.id,
      perk: benefit.perk,
      description: benefit.description || '',
    };
  }

  static toResponseList(benefits: CompanyBenefits[]): Array<{ id: string; perk: string; description: string }> {
    return benefits.map((benefit) => this.toResponse(benefit));
  }
}

