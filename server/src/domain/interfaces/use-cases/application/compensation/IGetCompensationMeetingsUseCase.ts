import { ATSCompensationMeetingResponseDto } from 'src/application/dtos/application/compensation/responses/ats-compensation-meeting-response.dto';

export interface IGetCompensationMeetingsUseCase {
  execute(applicationId: string): Promise<ATSCompensationMeetingResponseDto[]>;
}

