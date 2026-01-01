import { IS3Service } from '../../../domain/interfaces/services/IS3Service';
import { ValidationError } from '../../../domain/errors/errors';
import { IUploadBusinessLicenseUseCase } from '../../../domain/interfaces/use-cases/company/IUploadBusinessLicenseUseCase';
import { UploadBusinessLicenseResult } from '../../dtos/company/common/upload-business-license-result.dto';
import { UploadBusinessLicenseDto } from '../../dtos/company/common/upload-business-license.dto';

export class UploadBusinessLicenseUseCase implements IUploadBusinessLicenseUseCase {
  constructor(private readonly _s3Service: IS3Service) {}

  async execute(dto: UploadBusinessLicenseDto): Promise<UploadBusinessLicenseResult> {
    const { buffer, originalname, mimetype } = dto;
    this.validateFileType(mimetype, originalname);
    
    const key = await this._s3Service.uploadImage(buffer, originalname, mimetype);

    return {
      url: key,
      filename: originalname,
    };
  }

  private validateFileType(mimetype: string, filename: string): void {
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
    ];
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.pdf'];
    const fileExtension = filename.toLowerCase().substring(filename.lastIndexOf('.'));

    if (!allowedTypes.includes(mimetype) && !allowedExtensions.includes(fileExtension)) {
      throw new ValidationError(`File type ${mimetype} is not allowed for business license`);
    }
  }
}

