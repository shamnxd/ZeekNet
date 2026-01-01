import { ISeekerProfileRepository } from '../../../domain/interfaces/repositories/seeker/ISeekerProfileRepository';
import { IS3Service } from '../../../domain/interfaces/services/IS3Service';
import { SeekerProfileResponseDto } from '../../dtos/seeker/responses/seeker-profile-response.dto';
import { NotFoundError } from '../../../domain/errors/errors';
import { SeekerProfileMapper } from '../../mappers/seeker/seeker-profile.mapper';
import { IUploadAvatarUseCase } from 'src/domain/interfaces/use-cases/seeker/IUploadAvatarUseCase';
import { UploadAvatarDto } from '../../dtos/seeker/common/upload-avatar.dto';

export class UploadAvatarUseCase implements IUploadAvatarUseCase {
  constructor(
    private readonly _seekerProfileRepository: ISeekerProfileRepository,
    private readonly _s3Service: IS3Service,
  ) {}

  async execute(dto: UploadAvatarDto): Promise<SeekerProfileResponseDto> {
    const { userId, fileBuffer, fileName, mimeType } = dto;
    const profile = await this._seekerProfileRepository.findOne({ userId });
    if (!profile) {
      throw new NotFoundError('Seeker profile not found');
    }

    const avatarFileName = await this._s3Service.uploadImageToFolder(
      fileBuffer,
      fileName,
      mimeType,
      'seeker-avatars',
    );

    const updatedProfile = await this._seekerProfileRepository.update(profile.id, {
      avatarFileName,
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


