import { ATSCompensationMeeting } from 'src/domain/entities/ats-compensation-meeting.entity';

export interface IGetCompensationMeetingsUseCase {
  execute(applicationId: string): Promise<ATSCompensationMeeting[]>;
}

