import { SeekerProfileResponseDto } from 'src/application/dto/seeker/seeker-profile-response.dto';
import { UpdateSeekerProfileRequestDto } from 'src/application/dto/seeker/seeker-profile.dto';

// be

export interface IUpdateSeekerProfileUseCase {
  execute(userId: string, dto: UpdateSeekerProfileRequestDto): Promise<SeekerProfileResponseDto>;
}
