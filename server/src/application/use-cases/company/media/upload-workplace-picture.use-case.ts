import { IS3Service } from 'src/domain/interfaces/services/IS3Service';
import { ValidationError } from 'src/domain/errors/errors';
import { UploadWorkplacePictureResult } from 'src/application/dtos/company/media/responses/upload-workplace-picture-result.dto';
import { IUploadWorkplacePictureUseCase } from 'src/domain/interfaces/use-cases/company/media/IUploadWorkplacePictureUseCase';
import { UploadWorkplacePictureDto } from 'src/application/dtos/company/media/requests/upload-workplace-picture.dto';

export class UploadWorkplacePictureUseCase implements IUploadWorkplacePictureUseCase {
  constructor(private readonly _s3Service: IS3Service) {}

  async execute(dto: UploadWorkplacePictureDto): Promise<UploadWorkplacePictureResult> {
    const { buffer, originalname, mimetype } = dto;
    this.validateFileType(mimetype, originalname);
    this.validateFileSize(buffer.length);
    
    const key = await this._s3Service.uploadImage(buffer, originalname, mimetype);

    return {
      url: key,
      filename: originalname,
    };
  }

  private validateFileType(mimetype: string, filename: string): void {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const fileExtension = filename.toLowerCase().substring(filename.lastIndexOf('.'));

    if (!allowedTypes.includes(mimetype) && !allowedExtensions.includes(fileExtension)) {
      throw new ValidationError(`File type ${mimetype} is not allowed for workplace picture`);
    }
  }

  private validateFileSize(fileSize: number, maxSizeInMB: number = 5): void {
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

    if (fileSize > maxSizeInBytes) {
      throw new ValidationError(`File size must be less than ${maxSizeInMB}MB`);
    }
  }
}

