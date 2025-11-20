import { CompanyWorkplacePictures } from '../../../../domain/entities/company-workplace-pictures.entity';
import { CompanyWorkplacePicturesDocument } from '../models/company-workplace-pictures.model';

export class CompanyWorkplacePicturesMapper {
  static toEntity(doc: CompanyWorkplacePicturesDocument): CompanyWorkplacePictures {
    return CompanyWorkplacePictures.create({
      id: String(doc._id),
      companyId: doc.companyId.toString(),
      pictureUrl: doc.pictureUrl,
      caption: doc.caption,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }
}