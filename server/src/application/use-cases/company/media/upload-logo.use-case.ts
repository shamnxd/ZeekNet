import { injectable, inject } from 'inversify';
import { TYPES } from 'src/shared/constants/types';
import { IS3Service } from 'src/domain/interfaces/services/IS3Service';
import { ValidationError } from 'src/domain/errors/errors';
import { UploadLogoResult } from 'src/application/dtos/company/media/responses/upload-logo-result.dto';
import { UploadLogoRequestDto } from 'src/application/dtos/company/media/requests/upload-logo.dto';
import { IUploadLogoUseCase } from 'src/domain/interfaces/use-cases/company/media/IUploadLogoUseCase';
import { ICompanyProfileRepository } from 'src/domain/interfaces/repositories/company/ICompanyProfileRepository';

@injectable()
export class UploadLogoUseCase implements IUploadLogoUseCase {
  constructor(
    @inject(TYPES.S3Service) private readonly _s3Service: IS3Service,
    @inject(TYPES.CompanyProfileRepository) private readonly _companyProfileRepository: ICompanyProfileRepository,
  ) {}

  async execute(data: UploadLogoRequestDto & { userId: string }): Promise<UploadLogoResult> {
    const { buffer, originalname, mimetype, userId } = data;
    this.validateFileType(mimetype, originalname);
    
    const key = await this._s3Service.uploadImage(buffer, originalname, mimetype);

    const existingProfile = await this._companyProfileRepository.findOne({ userId });
    if (existingProfile) {
      await this._companyProfileRepository.update(existingProfile.id, { logo: key });
    }

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
