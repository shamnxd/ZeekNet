import { v4 as uuidv4 } from 'uuid';
import { IScheduleCompensationMeetingUseCase } from 'src/domain/interfaces/use-cases/application/compensation/IScheduleCompensationMeetingUseCase';
import { IATSCompensationMeetingRepository } from 'src/domain/interfaces/repositories/ats/IATSCompensationMeetingRepository';
import { IJobApplicationRepository } from 'src/domain/interfaces/repositories/job-application/IJobApplicationRepository';
import { IActivityLoggerService } from 'src/domain/interfaces/services/IActivityLoggerService';
import { ATSCompensationMeeting } from 'src/domain/entities/ats-compensation-meeting.entity';
import { ATSStage } from 'src/domain/enums/ats-stage.enum';
import { NotFoundError } from 'src/domain/errors/errors';
import { ScheduleCompensationMeetingRequestDto } from 'src/application/dtos/application/compensation/requests/schedule-compensation-meeting.dto';
import { ATSCompensationMeetingResponseDto } from 'src/application/dtos/application/compensation/responses/ats-compensation-meeting-response.dto';
import { ATSCompensationMeetingMapper } from 'src/application/mappers/ats/ats-compensation-meeting.mapper';
import { IUserRepository } from 'src/domain/interfaces/repositories/user/IUserRepository';

export class ScheduleCompensationMeetingUseCase implements IScheduleCompensationMeetingUseCase {
  constructor(
    private readonly _compensationMeetingRepository: IATSCompensationMeetingRepository,
    private readonly _jobApplicationRepository: IJobApplicationRepository,
    private readonly _activityLoggerService: IActivityLoggerService,
    private readonly _userRepository: IUserRepository,
  ) { }

  async execute(dto: ScheduleCompensationMeetingRequestDto): Promise<ATSCompensationMeetingResponseDto> {

    const application = await this._jobApplicationRepository.findById(dto.applicationId);
    if (!application) {
      throw new NotFoundError('Application not found');
    }

    const currentUser = await this._userRepository.findById(dto.performedBy);
    const performedByName = currentUser ? currentUser.name : 'Unknown';


    let webrtcRoomId = dto.webrtcRoomId;
    if (dto.type === 'online' && dto.videoType === 'in-app' && !webrtcRoomId) {
      webrtcRoomId = uuidv4();
    }

    // Combine date and time
    const scheduledDate = new Date(`${dto.date}T${dto.time}`);

    const meeting = ATSCompensationMeeting.create({
      id: uuidv4(),
      applicationId: dto.applicationId,
      type: dto.type,
      scheduledDate: scheduledDate,
      videoType: dto.videoType,
      webrtcRoomId,
      location: dto.location,
      meetingLink: dto.meetingLink,
      notes: dto.notes,
    });

    const created = await this._compensationMeetingRepository.create(meeting);


    await this._activityLoggerService.logCompensationMeetingActivity({
      applicationId: dto.applicationId,
      meetingId: created.id,
      type: 'scheduled',
      meetingType: dto.type,
      scheduledDate: scheduledDate,
      stage: ATSStage.COMPENSATION,
      subStage: application.subStage,
      performedBy: dto.performedBy,
      performedByName: performedByName,
    });

    return ATSCompensationMeetingMapper.toResponse(created);
  }
}
