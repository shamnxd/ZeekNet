import { SeekerProfileResponseDto } from 'src/application/dtos/seeker/profile/info/responses/seeker-profile-response.dto';
import { CreateSeekerProfileRequestDto } from 'src/application/dtos/seeker/profile/info/requests/create-seeker-profile-request.dto';

export interface ICreateSeekerProfileUseCase {
  execute(dto: CreateSeekerProfileRequestDto): Promise<SeekerProfileResponseDto>;
}

