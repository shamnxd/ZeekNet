import { ATSCompensationMeeting } from '../../../entities/ats-compensation-meeting.entity';

export interface IScheduleCompensationMeetingUseCase {
  execute(data: {
    applicationId: string;
    type: 'call' | 'online' | 'in-person';
    scheduledDate: Date;
    location?: string;
    meetingLink?: string;
    notes?: string;
    performedBy: string;
    performedByName: string;
  }): Promise<ATSCompensationMeeting>;
}

