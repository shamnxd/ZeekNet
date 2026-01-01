import { SeekerProfileResponseDto } from 'src/application/dtos/seeker/responses/seeker-profile-response.dto';
import { CreateSeekerProfileRequestDto } from 'src/application/dtos/seeker/requests/create-seeker-profile-request.dto';

export interface ICreateSeekerProfileUseCase {
  execute(dto: CreateSeekerProfileRequestDto): Promise<SeekerProfileResponseDto>;
}

