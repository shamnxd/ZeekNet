import { CompanyContact } from '../../../../domain/entities/company-contact.entity';
import { CompanyContactDocument } from '../models/company-contact.model';

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
}