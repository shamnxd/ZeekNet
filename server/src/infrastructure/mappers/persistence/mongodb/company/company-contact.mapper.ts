import { CompanyContact } from 'src/domain/entities/company-contact.entity';
import { CompanyContactDocument } from 'src/infrastructure/persistence/mongodb/models/company-contact.model';

export class CompanyContactMapper {
  static toEntity(doc: CompanyContactDocument): CompanyContact {
    return CompanyContact.create({
      id: String(doc._id),
      companyId: doc.companyId.toString(),
      twitterLink: doc.twitterLink,
      facebookLink: doc.facebookLink,
      linkedin: doc.linkedin,
      email: doc.email,
      phone: doc.phone,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  static toDocument(entity: CompanyContact): Partial<CompanyContactDocument> {
    return {
      companyId: entity.companyId,
      twitterLink: entity.twitterLink,
      facebookLink: entity.facebookLink,
      linkedin: entity.linkedin,
      email: entity.email,
      phone: entity.phone,
    };
  }
}

