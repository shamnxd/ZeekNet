import { v4 as uuidv4 } from 'uuid';
import { IScheduleCompensationMeetingUseCase } from 'src/domain/interfaces/use-cases/application/compensation/IScheduleCompensationMeetingUseCase';
import { IATSCompensationMeetingRepository } from 'src/domain/interfaces/repositories/ats/IATSCompensationMeetingRepository';
import { IJobApplicationRepository } from 'src/domain/interfaces/repositories/job-application/IJobApplicationRepository';
import { IActivityLoggerService } from 'src/domain/interfaces/services/IActivityLoggerService';
import { ATSCompensationMeeting } from 'src/domain/entities/ats-compensation-meeting.entity';
import { ATSStage } from 'src/domain/enums/ats-stage.enum';
import { NotFoundError } from 'src/domain/errors/errors';

export class ScheduleCompensationMeetingUseCase implements IScheduleCompensationMeetingUseCase {
  constructor(
    private compensationMeetingRepository: IATSCompensationMeetingRepository,
    private jobApplicationRepository: IJobApplicationRepository,
    private activityLoggerService: IActivityLoggerService,
  ) {}

  async execute(data: {
    applicationId: string;
    type: 'call' | 'online' | 'in-person';
    scheduledDate: Date;
    videoType?: 'in-app' | 'external';
    webrtcRoomId?: string;
    location?: string;
    meetingLink?: string;
    notes?: string;
    performedBy: string;
    performedByName: string;
  }): Promise<ATSCompensationMeeting> {
    
    const application = await this.jobApplicationRepository.findById(data.applicationId);
    if (!application) {
      throw new NotFoundError('Application not found');
    }

    
    let webrtcRoomId = data.webrtcRoomId;
    if (data.type === 'online' && data.videoType === 'in-app' && !webrtcRoomId) {
      webrtcRoomId = uuidv4();
    }

    const meeting = ATSCompensationMeeting.create({
      id: uuidv4(),
      applicationId: data.applicationId,
      type: data.type,
      scheduledDate: data.scheduledDate,
      videoType: data.videoType,
      webrtcRoomId,
      location: data.location,
      meetingLink: data.meetingLink,
      notes: data.notes,
    });

    const created = await this.compensationMeetingRepository.create(meeting);

    
    await this.activityLoggerService.logCompensationMeetingActivity({
      applicationId: data.applicationId,
      meetingId: created.id,
      type: 'scheduled',
      meetingType: data.type,
      scheduledDate: data.scheduledDate,
      stage: ATSStage.COMPENSATION,
      subStage: application.subStage,
      performedBy: data.performedBy,
      performedByName: data.performedByName,
    });

    return created;
  }
}

