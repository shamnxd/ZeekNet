import { EducationResponseDto } from 'src/application/dto/seeker/seeker-profile-response.dto';


export interface IGetEducationUseCase {
  execute(userId: string): Promise<EducationResponseDto[]>;
}
