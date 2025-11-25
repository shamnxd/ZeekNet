import { IS3Service } from '../../../domain/interfaces/services/IS3Service';
import { ValidationError } from '../../../domain/errors/errors';
import { IUploadWorkplacePictureUseCase, UploadWorkplacePictureResult } from '../../../domain/interfaces/use-cases/ICompanyUseCases';

export class UploadWorkplacePictureUseCase implements IUploadWorkplacePictureUseCase {
  constructor(private readonly _s3Service: IS3Service) {}

  async execute(buffer: Buffer, originalname: string, mimetype: string): Promise<UploadWorkplacePictureResult> {
    this.validateFileType(mimetype, originalname);
    this.validateFileSize(buffer.length);
    
    const imageUrl = await this._s3Service.uploadImage(buffer, originalname, mimetype);

    return {
      url: imageUrl,
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
