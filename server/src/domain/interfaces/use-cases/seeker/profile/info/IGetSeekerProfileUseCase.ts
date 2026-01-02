import { SeekerProfileResponseDto } from 'src/application/dtos/seeker/profile/info/responses/seeker-profile-response.dto';


export interface IGetSeekerProfileUseCase {
  execute(userId: string): Promise<SeekerProfileResponseDto>;
}

