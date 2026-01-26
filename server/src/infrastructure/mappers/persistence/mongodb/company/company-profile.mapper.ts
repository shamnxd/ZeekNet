import { CompanyProfile } from 'src/domain/entities/company-profile.entity';
import { CompanyProfileDocument } from 'src/infrastructure/persistence/mongodb/models/company-profile.model';

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

  static toDocument(entity: Partial<CompanyProfile>): Partial<CompanyProfileDocument> {
    const doc: Partial<CompanyProfileDocument> = {};

    if (entity.userId !== undefined) doc.userId = entity.userId;
    if (entity.companyName !== undefined) doc.companyName = entity.companyName;
    if (entity.logo !== undefined) doc.logo = entity.logo;
    if (entity.banner !== undefined) doc.banner = entity.banner;
    if (entity.websiteLink !== undefined) doc.websiteLink = entity.websiteLink;
    if (entity.employeeCount !== undefined) doc.employeeCount = entity.employeeCount;
    if (entity.industry !== undefined) doc.industry = entity.industry;
    if (entity.organisation !== undefined) doc.organisation = entity.organisation;
    if (entity.aboutUs !== undefined) doc.aboutUs = entity.aboutUs;
    if (entity.isVerified !== undefined) doc.isVerified = entity.isVerified;
    if (entity.rejectionReason !== undefined) doc.rejectionReason = entity.rejectionReason;

    return doc;
  }
}

