import { IS3Service } from '../../../domain/interfaces/services/IS3Service';
import { ValidationError } from '../../../domain/errors/errors';
import { UploadLogoResult } from 'src/domain/interfaces/use-cases/public/UploadLogoResult';
import { UploadLogoRequestDto } from '../../dto/company/upload-logo.dto';
import { IUploadLogoUseCase } from 'src/domain/interfaces/use-cases/company/IUploadLogoUseCase';

export class UploadLogoUseCase implements IUploadLogoUseCase {
  constructor(private readonly _s3Service: IS3Service) {}

  async execute(data: UploadLogoRequestDto): Promise<UploadLogoResult> {
    const { buffer, originalname, mimetype } = data;
    this.validateFileType(mimetype, originalname);
    
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
      throw new ValidationError(`File type ${mimetype} is not allowed for logo`);
    }
  }
}
