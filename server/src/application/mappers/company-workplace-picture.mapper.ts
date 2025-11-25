import { CompanyWorkplacePictures } from '../../domain/entities/company-workplace-pictures.entity';

export class CompanyWorkplacePictureMapper {
  static toResponse(picture: CompanyWorkplacePictures): { id: string; pictureUrl: string; caption?: string } {
    return {
      id: picture.id,
      pictureUrl: picture.pictureUrl,
      caption: picture.caption,
    };
  }

  static toResponseList(pictures: CompanyWorkplacePictures[]): Array<{ id: string; pictureUrl: string; caption?: string }> {
    return pictures.map((picture) => this.toResponse(picture));
  }
}

