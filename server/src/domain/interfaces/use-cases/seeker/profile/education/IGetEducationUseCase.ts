import { EducationResponseDto } from 'src/application/dtos/seeker/profile/info/responses/seeker-profile-response.dto';


export interface IGetEducationUseCase {
  execute(userId: string): Promise<EducationResponseDto[]>;
}

