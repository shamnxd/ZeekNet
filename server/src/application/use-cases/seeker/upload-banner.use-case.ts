import { IUploadBannerUseCase } from '../../../domain/interfaces/use-cases/seeker/IUploadBannerUseCase';
import { ISeekerProfileRepository } from '../../../domain/interfaces/repositories/seeker/ISeekerProfileRepository';
import { IS3Service } from '../../../domain/interfaces/services/IS3Service';
import { SeekerProfileResponseDto } from '../../dtos/seeker/responses/seeker-profile-response.dto';
import { NotFoundError } from '../../../domain/errors/errors';
import { SeekerProfileMapper } from '../../mappers/seeker/seeker-profile.mapper';
import { UploadBannerDto } from '../../dtos/seeker/common/upload-banner.dto';

export class UploadBannerUseCase implements IUploadBannerUseCase {
  constructor(
    private readonly _seekerProfileRepository: ISeekerProfileRepository,
    private readonly _s3Service: IS3Service,
  ) {}

  async execute(dto: UploadBannerDto): Promise<SeekerProfileResponseDto> {
    const { userId, fileBuffer, fileName, mimeType } = dto;
    const profile = await this._seekerProfileRepository.findOne({ userId });
    if (!profile) {
      throw new NotFoundError('Seeker profile not found');
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
      throw new NotFoundError('Failed to update profile');
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


