import { v4 as uuidv4 } from 'uuid';
import { IScheduleCompensationMeetingUseCase } from '../../../domain/interfaces/use-cases/ats/IScheduleCompensationMeetingUseCase';
import { IATSCompensationMeetingRepository } from '../../../domain/interfaces/repositories/ats/IATSCompensationMeetingRepository';
import { IJobApplicationRepository } from '../../../domain/interfaces/repositories/job-application/IJobApplicationRepository';
import { IActivityLoggerService } from '../../../domain/interfaces/services/IActivityLoggerService';
import { ATSCompensationMeeting } from '../../../domain/entities/ats-compensation-meeting.entity';
import { ATSStage } from '../../../domain/enums/ats-stage.enum';
import { NotFoundError } from '../../../domain/errors/errors';

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
    // Get application to verify it exists and get current subStage
    const application = await this.jobApplicationRepository.findById(data.applicationId);
    if (!application) {
      throw new NotFoundError('Application not found');
    }

    // Generate webrtcRoomId if videoType is 'in-app' and not provided
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

    // Log activity
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

