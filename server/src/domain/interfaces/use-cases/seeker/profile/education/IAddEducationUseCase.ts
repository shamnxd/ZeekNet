import { EducationResponseDto } from 'src/application/dtos/seeker/profile/info/responses/seeker-profile-response.dto';
import { AddEducationRequestDto } from 'src/application/dtos/seeker/profile/education/requests/add-education-request.dto';


export interface IAddEducationUseCase {
  execute(userId: string, dto: AddEducationRequestDto): Promise<EducationResponseDto>;
}

