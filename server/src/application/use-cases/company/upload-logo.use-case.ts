import { IS3Service } from '../../../domain/interfaces/services/IS3Service';
import { ValidationError } from '../../../domain/errors/errors';
import { UploadLogoResult } from '../../dto/public/upload-logo-result.dto';
import { UploadLogoRequestDto } from '../../dto/company/upload-logo.dto';
import { IUploadLogoUseCase } from 'src/domain/interfaces/use-cases/company/IUploadLogoUseCase';
import { ICompanyProfileRepository } from '../../../domain/interfaces/repositories/company/ICompanyProfileRepository';

export class UploadLogoUseCase implements IUploadLogoUseCase {
  constructor(
    private readonly _s3Service: IS3Service,
    private readonly _companyProfileRepository: ICompanyProfileRepository,
  ) {}

  async execute(data: UploadLogoRequestDto & { userId: string }): Promise<UploadLogoResult> {
    const { buffer, originalname, mimetype, userId } = data;
    this.validateFileType(mimetype, originalname);
    
    // Upload to S3
    const key = await this._s3Service.uploadImage(buffer, originalname, mimetype);

    // Update company profile with new logo key
    const existingProfile = await this._companyProfileRepository.findOne({ userId });
    if (existingProfile) {
      await this._companyProfileRepository.update(existingProfile.id, { logo: key });
    }

    // Generate signed URL for immediate display
    const signedUrl = await this._s3Service.getSignedUrl(key);

    return {
      url: signedUrl,
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
