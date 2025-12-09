import { SeekerProfileResponseDto } from 'src/application/dto/seeker/seeker-profile-response.dto';
import { CreateSeekerProfileRequestDto } from 'src/application/dto/seeker/seeker-profile.dto';

// be

export interface ICreateSeekerProfileUseCase {
  execute(userId: string, dto: CreateSeekerProfileRequestDto): Promise<SeekerProfileResponseDto>;
}
