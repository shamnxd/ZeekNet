import { SeekerProfileResponseDto } from 'src/application/dtos/seeker/profile/info/responses/seeker-profile-response.dto';
import { UploadAvatarDto } from 'src/application/dtos/seeker/media/requests/upload-avatar.dto';

export interface IUploadAvatarUseCase {
  execute(dto: UploadAvatarDto): Promise<SeekerProfileResponseDto>;
}

