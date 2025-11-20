import { CompanyBenefits } from '../../../../domain/entities/company-benefits.entity';
import { CompanyBenefitsDocument } from '../models/company-benefits.model';

export class CompanyBenefitsMapper {
  static toEntity(doc: CompanyBenefitsDocument): CompanyBenefits {
    return CompanyBenefits.create({
      id: String(doc._id),
      companyId: doc.companyId.toString(),
      perk: doc.perk,
      description: doc.description,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }
}