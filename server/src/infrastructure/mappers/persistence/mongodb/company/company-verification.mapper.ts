import { CompanyVerification } from 'src/domain/entities/company-verification.entity';
import { CompanyVerificationDocument } from 'src/infrastructure/persistence/mongodb/models/company-verification.model';

export class CompanyVerificationMapper {
  static toEntity(doc: CompanyVerificationDocument): CompanyVerification {
    return CompanyVerification.create({
      id: String(doc._id),
      companyId: doc.companyId,
      taxId: doc.taxId,
      businessLicenseUrl: doc.businessLicenseUrl,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  static toDocument(entity: CompanyVerification): Partial<CompanyVerificationDocument> {
    return {
      companyId: entity.companyId,
      taxId: entity.taxId,
      businessLicenseUrl: entity.businessLicenseUrl,
    };
  }
}

