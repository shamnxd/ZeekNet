import { SeekerProfileResponseDto } from 'src/application/dtos/seeker/profile/info/responses/seeker-profile-response.dto';
import { UpdateSeekerProfileRequestDto } from 'src/application/dtos/seeker/profile/info/requests/update-seeker-profile-request.dto';

export interface IUpdateSeekerProfileUseCase {
  execute(dto: UpdateSeekerProfileRequestDto): Promise<SeekerProfileResponseDto>;
}

