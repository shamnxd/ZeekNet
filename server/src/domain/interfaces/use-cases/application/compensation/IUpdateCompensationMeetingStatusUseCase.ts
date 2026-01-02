import { ATSCompensationMeeting } from 'src/domain/entities/ats-compensation-meeting.entity';

export interface IUpdateCompensationMeetingStatusUseCase {
  execute(data: {
    meetingId: string;
    applicationId: string;
    status: 'scheduled' | 'completed' | 'cancelled';
    performedBy: string;
    performedByName: string;
  }): Promise<ATSCompensationMeeting>;
}

