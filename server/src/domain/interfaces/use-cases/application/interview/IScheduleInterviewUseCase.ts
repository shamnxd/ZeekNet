import { ScheduleInterviewRequestDto } from 'src/application/dtos/application/interview/requests/schedule-interview.dto';
import { ATSInterviewResponseDto } from 'src/application/dtos/application/interview/responses/ats-interview-response.dto';

export interface IScheduleInterviewUseCase {
  execute(data: ScheduleInterviewRequestDto): Promise<ATSInterviewResponseDto>;
}
