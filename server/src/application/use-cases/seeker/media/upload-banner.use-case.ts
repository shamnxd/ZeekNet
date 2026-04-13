import { IUploadBannerUseCase } from 'src/domain/interfaces/use-cases/seeker/media/IUploadBannerUseCase';
import { ISeekerProfileRepository } from 'src/domain/interfaces/repositories/seeker/ISeekerProfileRepository';
import { IS3Service } from 'src/domain/interfaces/services/IS3Service';
import { SeekerProfileResponseDto } from 'src/application/dtos/seeker/profile/info/responses/seeker-profile-response.dto';
import { NotFoundError } from 'src/domain/errors/errors';
import { SeekerProfileMapper } from 'src/application/mappers/seeker/seeker-profile.mapper';
import { UploadBannerDto } from 'src/application/dtos/seeker/media/requests/upload-banner.dto';

import { injectable, inject } from 'inversify';
import { TYPES } from 'src/shared/constants/types';
import { ERROR } from 'src/shared/constants/messages';


@injectable()
export class UploadBannerUseCase implements IUploadBannerUseCase {
  constructor(
    @inject(TYPES.SeekerProfileRepository) private readonly _seekerProfileRepository: ISeekerProfileRepository,
    @inject(TYPES.S3Service) private readonly _s3Service: IS3Service,
  ) {}

  async execute(dto: UploadBannerDto): Promise<SeekerProfileResponseDto> {
    const { userId, fileBuffer, fileName, mimeType } = dto;
    const profile = await this._seekerProfileRepository.findOne({ userId });
    if (!profile) {
      throw new NotFoundError(ERROR.NOT_FOUND('Seeker profile'));
    }

    const bannerFileName = await this._s3Service.uploadImageToFolder(
      fileBuffer,
      fileName,
      mimeType,
      'seeker-banners',
    );

    const updatedProfile = await this._seekerProfileRepository.update(profile.id, {
      bannerFileName,
    });

    if (!updatedProfile) {
      throw new NotFoundError(ERROR.FAILED_TO('update profile'));
    }

    const [avatarUrl, bannerUrl, resumeUrl] = await Promise.all([
      updatedProfile.avatarFileName ? this._s3Service.getSignedUrl(updatedProfile.avatarFileName) : Promise.resolve(null),
      updatedProfile.bannerFileName ? this._s3Service.getSignedUrl(updatedProfile.bannerFileName) : Promise.resolve(null),
      updatedProfile.resume?.url ? (updatedProfile.resume.url.includes('/') && !updatedProfile.resume.url.startsWith('http') 
        ? this._s3Service.getSignedUrl(updatedProfile.resume.url) 
        : Promise.resolve(updatedProfile.resume.url)) : Promise.resolve(null),
    ]);

    return SeekerProfileMapper.toResponse(updatedProfile, this._s3Service, { avatarUrl, bannerUrl, resumeUrl });
  }
}


