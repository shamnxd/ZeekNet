import { UpdateInterviewRequestDto } from 'src/application/dtos/application/interview/requests/update-interview.dto';
import { ATSInterviewResponseDto } from 'src/application/dtos/application/interview/responses/ats-interview-response.dto';

export interface IUpdateInterviewUseCase {
  execute(data: UpdateInterviewRequestDto): Promise<ATSInterviewResponseDto>;
}

