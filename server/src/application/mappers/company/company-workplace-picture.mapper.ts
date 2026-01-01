import { CompanyWorkplacePictures } from '../../../domain/entities/company-workplace-pictures.entity';

export class CompanyWorkplacePictureMapper {
  static toResponse(picture: CompanyWorkplacePictures, signedUrl?: string): { id: string; pictureUrl: string; caption?: string } {
    return {
      id: picture.id,
      pictureUrl: signedUrl || picture.pictureUrl,
      caption: picture.caption,
    };
  }

  static toResponseList(pictures: CompanyWorkplacePictures[], signedUrls?: string[]): Array<{ id: string; pictureUrl: string; caption?: string }> {
    return pictures.map((picture, index) => this.toResponse(picture, signedUrls?.[index]));
  }
}


