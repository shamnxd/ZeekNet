import { SeekerProfileResponseDto } from 'src/application/dto/seeker/seeker-profile-response.dto';


export interface IGetSeekerProfileUseCase {
  execute(userId: string): Promise<SeekerProfileResponseDto>;
}
