import { SeekerProfileResponseDto } from 'src/application/dtos/seeker/responses/seeker-profile-response.dto';
import { UpdateSeekerProfileRequestDto } from 'src/application/dtos/seeker/requests/update-seeker-profile-request.dto';

export interface IUpdateSeekerProfileUseCase {
  execute(dto: UpdateSeekerProfileRequestDto): Promise<SeekerProfileResponseDto>;
}

