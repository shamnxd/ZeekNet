import { EducationResponseDto } from 'src/application/dtos/seeker/responses/seeker-profile-response.dto';


export interface IGetEducationUseCase {
  execute(userId: string): Promise<EducationResponseDto[]>;
}

