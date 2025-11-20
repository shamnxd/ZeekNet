import { CompanyVerification } from '../../../../domain/entities/company-verification.entity';
import { CompanyVerificationDocument } from '../models/company-verification.model';

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
}