import { CompanyWorkplacePictures } from 'src/domain/entities/company-workplace-pictures.entity';
import { CompanyWorkplacePictureResponseDto } from 'src/application/dtos/company/media/responses/company-workplace-picture-response.dto';

export class CompanyWorkplacePictureMapper {
  static toResponse(picture: CompanyWorkplacePictures, signedUrl?: string): CompanyWorkplacePictureResponseDto {
    return {
      id: picture.id,
      pictureUrl: signedUrl || picture.pictureUrl,
      caption: picture.caption,
      createdAt: picture.createdAt,
      updatedAt: picture.updatedAt,
    };
  }

  static toResponseList(pictures: CompanyWorkplacePictures[], signedUrls?: string[]): CompanyWorkplacePictureResponseDto[] {
    return pictures.map((picture, index) => this.toResponse(picture, signedUrls?.[index]));
  }
}


