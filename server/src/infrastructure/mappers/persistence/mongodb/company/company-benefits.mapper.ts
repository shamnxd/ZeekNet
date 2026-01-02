import { CompanyBenefits } from 'src/domain/entities/company-benefits.entity';
import { CompanyBenefitsDocument } from 'src/infrastructure/persistence/mongodb/models/company-benefits.model';

import { Types } from 'mongoose';

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

  static toDocument(entity: CompanyBenefits): Partial<CompanyBenefitsDocument> {
    return {
      companyId: new Types.ObjectId(entity.companyId),
      perk: entity.perk,
      description: entity.description,
    };
  }
}

