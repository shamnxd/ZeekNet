import { ATSInterview } from '../../../entities/ats-interview.entity';

export interface IScheduleInterviewUseCase {
  execute(data: {
    applicationId: string;
    title: string;
    scheduledDate: Date;
    type: 'online' | 'offline';
    videoType?: 'in-app' | 'external';
    webrtcRoomId?: string;
    meetingLink?: string;
    location?: string;
    performedBy: string;
    performedByName: string;
  }): Promise<ATSInterview>;
}
