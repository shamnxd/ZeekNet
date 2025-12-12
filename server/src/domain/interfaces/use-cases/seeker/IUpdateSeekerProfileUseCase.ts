import { SeekerProfileResponseDto } from 'src/application/dto/seeker/seeker-profile-response.dto';
import { UpdateSeekerProfileRequestDto } from 'src/application/dto/seeker/update-seeker-profile-request.dto';

export interface IUpdateSeekerProfileUseCase {
  execute(dto: UpdateSeekerProfileRequestDto): Promise<SeekerProfileResponseDto>;
}
