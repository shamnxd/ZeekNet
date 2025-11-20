import { CompanyProfile } from '../../../../domain/entities/company-profile.entity';
import { CompanyProfileDocument } from '../models/company-profile.model';

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
}