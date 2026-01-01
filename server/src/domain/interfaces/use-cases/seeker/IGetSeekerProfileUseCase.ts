import { SeekerProfileResponseDto } from 'src/application/dtos/seeker/responses/seeker-profile-response.dto';


export interface IGetSeekerProfileUseCase {
  execute(userId: string): Promise<SeekerProfileResponseDto>;
}

