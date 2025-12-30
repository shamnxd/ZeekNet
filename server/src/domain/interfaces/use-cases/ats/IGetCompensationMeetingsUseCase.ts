import { ATSCompensationMeeting } from '../../../entities/ats-compensation-meeting.entity';

export interface IGetCompensationMeetingsUseCase {
  execute(applicationId: string): Promise<ATSCompensationMeeting[]>;
}

