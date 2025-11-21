import { IUploadAvatarUseCase } from '../../../domain/interfaces/use-cases/ISeekerUseCases';
import { ISeekerProfileRepository } from '../../../domain/interfaces/repositories/seeker/ISeekerProfileRepository';
import { IS3Service } from '../../../domain/interfaces/services/IS3Service';
import { SeekerProfileResponseDto } from '../../dto/seeker/seeker-profile-response.dto';
import { NotFoundError } from '../../../domain/errors/errors';
import { SeekerProfileMapper } from '../../mappers/seeker-profile.mapper';

export class UploadAvatarUseCase implements IUploadAvatarUseCase {
  constructor(
    private readonly _seekerProfileRepository: ISeekerProfileRepository,
    private readonly _s3Service: IS3Service,
  ) {}

  async execute(userId: string, fileBuffer: Buffer, fileName: string, mimeType: string): Promise<SeekerProfileResponseDto> {
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

    return SeekerProfileMapper.toDto(updatedProfile, this._s3Service);
  }
}
