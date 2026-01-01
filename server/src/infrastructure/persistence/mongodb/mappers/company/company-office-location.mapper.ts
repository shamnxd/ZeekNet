import { CompanyOfficeLocation } from '../../../../../domain/entities/company-office-location.entity';
import { CompanyOfficeLocationDocument } from '../../models/company-office-location.model';

import { Types } from 'mongoose';

export class CompanyOfficeLocationMapper {
  static toEntity(doc: CompanyOfficeLocationDocument): CompanyOfficeLocation {
    return CompanyOfficeLocation.create({
      id: String(doc._id),
      companyId: doc.companyId.toString(),
      location: doc.location,
      isHeadquarters: doc.isHeadquarters,
      officeName: doc.officeName,
      address: doc.address,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  static toDocument(entity: CompanyOfficeLocation): Partial<CompanyOfficeLocationDocument> {
    return {
      companyId: new Types.ObjectId(entity.companyId),
      location: entity.location,
      isHeadquarters: entity.isHeadquarters,
      officeName: entity.officeName,
      address: entity.address,
    };
  }
}

