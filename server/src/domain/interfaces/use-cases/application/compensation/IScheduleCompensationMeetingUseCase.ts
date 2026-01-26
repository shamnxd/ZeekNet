import { ScheduleCompensationMeetingRequestDto } from 'src/application/dtos/application/compensation/requests/schedule-compensation-meeting.dto';
import { ATSCompensationMeetingResponseDto } from 'src/application/dtos/application/compensation/responses/ats-compensation-meeting-response.dto';

export interface IScheduleCompensationMeetingUseCase {
  execute(dto: ScheduleCompensationMeetingRequestDto): Promise<ATSCompensationMeetingResponseDto>;
}
