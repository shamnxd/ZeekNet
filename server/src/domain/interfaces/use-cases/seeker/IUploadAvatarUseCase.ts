import { SeekerProfileResponseDto } from 'src/application/dtos/seeker/responses/seeker-profile-response.dto';
import { UploadAvatarDto } from 'src/application/dtos/seeker/common/upload-avatar.dto';

export interface IUploadAvatarUseCase {
  execute(dto: UploadAvatarDto): Promise<SeekerProfileResponseDto>;
}

