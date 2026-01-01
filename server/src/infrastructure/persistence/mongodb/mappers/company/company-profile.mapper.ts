import { CompanyProfile } from '../../../../../domain/entities/company-profile.entity';
import { CompanyProfileDocument } from '../../models/company-profile.model';

export class CompanyProfileMapper {
  static toEntity(doc: CompanyProfileDocument): CompanyProfile {
    return CompanyProfile.create({
      id: String(doc._id),
      userId: doc.userId,
      companyName: doc.companyName,
      logo: doc.logo,
      banner: doc.banner,
      websiteLink: doc.websiteLink,
      employeeCount: doc.employeeCount,
      industry: doc.industry,
      organisation: doc.organisation,
      aboutUs: doc.aboutUs,
      isVerified: doc.isVerified,
      rejectionReason: doc.rejectionReason,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  static toDocument(entity: CompanyProfile): Partial<CompanyProfileDocument> {
    return {
      userId: entity.userId,
      companyName: entity.companyName,
      logo: entity.logo,
      banner: entity.banner,
      websiteLink: entity.websiteLink,
      employeeCount: entity.employeeCount,
      industry: entity.industry,
      organisation: entity.organisation,
      aboutUs: entity.aboutUs,
      isVerified: entity.isVerified,
      rejectionReason: entity.rejectionReason,
    };
  }
}

