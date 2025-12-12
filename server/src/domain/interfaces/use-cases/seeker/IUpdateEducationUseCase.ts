import { EducationResponseDto } from 'src/application/dto/seeker/seeker-profile-response.dto';
import { UpdateEducationRequestDto } from 'src/application/dto/seeker/update-education-request.dto';

export interface IUpdateEducationUseCase {
  execute(dto: UpdateEducationRequestDto): Promise<EducationResponseDto>;
}
