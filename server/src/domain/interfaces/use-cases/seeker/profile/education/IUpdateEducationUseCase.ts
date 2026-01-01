import { EducationResponseDto } from 'src/application/dtos/seeker/profile/info/responses/seeker-profile-response.dto';
import { UpdateEducationRequestDto } from 'src/application/dtos/seeker/profile/education/requests/update-education-request.dto';

export interface IUpdateEducationUseCase {
  execute(dto: UpdateEducationRequestDto): Promise<EducationResponseDto>;
}

