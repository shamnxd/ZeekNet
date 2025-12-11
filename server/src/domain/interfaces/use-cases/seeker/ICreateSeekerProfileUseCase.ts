import { SeekerProfileResponseDto } from 'src/application/dto/seeker/seeker-profile-response.dto';
import { CreateSeekerProfileRequestDto } from 'src/application/dto/seeker/create-seeker-profile-request.dto';

export interface ICreateSeekerProfileUseCase {
  execute(dto: CreateSeekerProfileRequestDto): Promise<SeekerProfileResponseDto>;
}
