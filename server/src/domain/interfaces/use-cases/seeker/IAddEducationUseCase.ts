import { EducationResponseDto } from 'src/application/dtos/seeker/responses/seeker-profile-response.dto';
import { AddEducationRequestDto } from 'src/application/dtos/seeker/common/add-education-request.dto';


export interface IAddEducationUseCase {
  execute(userId: string, dto: AddEducationRequestDto): Promise<EducationResponseDto>;
}

