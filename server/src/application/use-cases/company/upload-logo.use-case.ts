import { IS3Service } from '../../../domain/interfaces/services/IS3Service';
import { ValidationError } from '../../../domain/errors/errors';
import { IUploadLogoUseCase, UploadLogoResult } from '../../../domain/interfaces/use-cases/ICompanyUseCases';

export class UploadLogoUseCase implements IUploadLogoUseCase {
  constructor(private readonly _s3Service: IS3Service) {}

  async execute(buffer: Buffer, originalname: string, mimetype: string): Promise<UploadLogoResult> {
    this.validateFileType(mimetype, originalname);
    
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
      throw new ValidationError(`File type ${mimetype} is not allowed for logo`);
    }
  }
}
