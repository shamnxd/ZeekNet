import { ATSInterviewResponseDto } from 'src/application/dtos/application/interview/responses/ats-interview-response.dto';

export interface IGetInterviewsByApplicationUseCase {
  execute(applicationId: string): Promise<ATSInterviewResponseDto[]>;
}

