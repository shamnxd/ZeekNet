import { EducationResponseDto } from 'src/application/dto/seeker/seeker-profile-response.dto';
import { AddEducationRequestDto } from 'src/application/dto/seeker/seeker-profile.dto';


export interface IAddEducationUseCase {
  execute(userId: string, dto: AddEducationRequestDto): Promise<EducationResponseDto>;
}
