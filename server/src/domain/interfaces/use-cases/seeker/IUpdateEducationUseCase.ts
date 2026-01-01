import { EducationResponseDto } from 'src/application/dtos/seeker/responses/seeker-profile-response.dto';
import { UpdateEducationRequestDto } from 'src/application/dtos/seeker/requests/update-education-request.dto';

export interface IUpdateEducationUseCase {
  execute(dto: UpdateEducationRequestDto): Promise<EducationResponseDto>;
}

