import { SeekerProfileResponseDto } from 'src/application/dto/seeker/seeker-profile-response.dto';
import { UploadAvatarDto } from 'src/application/dto/seeker/upload-avatar.dto';

export interface IUploadAvatarUseCase {
  execute(dto: UploadAvatarDto): Promise<SeekerProfileResponseDto>;
}
