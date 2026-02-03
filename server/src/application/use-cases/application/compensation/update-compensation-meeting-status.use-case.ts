import { IUpdateCompensationMeetingStatusUseCase } from 'src/domain/interfaces/use-cases/application/compensation/IUpdateCompensationMeetingStatusUseCase';
import { IATSCompensationMeetingRepository } from 'src/domain/interfaces/repositories/ats/IATSCompensationMeetingRepository';
import { IJobApplicationRepository } from 'src/domain/interfaces/repositories/job-application/IJobApplicationRepository';
import { IActivityLoggerService } from 'src/domain/interfaces/services/IActivityLoggerService';
import { ATSCompensationMeeting } from 'src/domain/entities/ats-compensation-meeting.entity';
import { ATSStage } from 'src/domain/enums/ats-stage.enum';
import { NotFoundError, ValidationError } from 'src/domain/errors/errors';
import { UpdateCompensationMeetingStatusRequestDto } from 'src/application/dtos/application/compensation/requests/update-compensation-meeting-status.dto';
import { ATSCompensationMeetingResponseDto } from 'src/application/dtos/application/compensation/responses/ats-compensation-meeting-response.dto';
import { ATSCompensationMeetingMapper } from 'src/application/mappers/ats/ats-compensation-meeting.mapper';
import { IUserRepository } from 'src/domain/interfaces/repositories/user/IUserRepository';

export class UpdateCompensationMeetingStatusUseCase implements IUpdateCompensationMeetingStatusUseCase {
  constructor(
    private readonly _compensationMeetingRepository: IATSCompensationMeetingRepository,
    private readonly _jobApplicationRepository: IJobApplicationRepository,
    private readonly _activityLoggerService: IActivityLoggerService,
    private readonly _userRepository: IUserRepository,
  ) { }

  async execute(dto: UpdateCompensationMeetingStatusRequestDto): Promise<ATSCompensationMeetingResponseDto> {
    if (!['scheduled', 'completed', 'cancelled'].includes(dto.status)) {
      throw new ValidationError('Invalid status. Must be scheduled, completed, or cancelled');
    }

    const meeting = await this._compensationMeetingRepository.findById(dto.meetingId);
    if (!meeting) {
      throw new NotFoundError('Meeting not found');
    }

    if (meeting.applicationId !== dto.applicationId) {
      throw new ValidationError('Meeting does not belong to this application');
    }


    const application = await this._jobApplicationRepository.findById(dto.applicationId);
    if (!application) {
      throw new NotFoundError('Application not found');
    }

    const currentUser = await this._userRepository.findById(dto.performedBy);
    const performedByName = currentUser ? currentUser.name : 'Unknown';

    const updateData: Partial<ATSCompensationMeeting> & { status: 'scheduled' | 'completed' | 'cancelled'; completedAt?: Date } = {
      status: dto.status,
    };

    if (dto.status === 'completed') {
      updateData.completedAt = new Date();
    }

    const updated = await this._compensationMeetingRepository.update(dto.meetingId, updateData);

    if (!updated) {
      throw new NotFoundError('Failed to update meeting status');
    }


    await this._activityLoggerService.logCompensationMeetingActivity({
      applicationId: dto.applicationId,
      meetingId: updated.id,
      type: 'status_updated',
      status: dto.status,
      stage: ATSStage.COMPENSATION,
      subStage: application.subStage,
      performedBy: dto.performedBy,
      performedByName: performedByName,
    });

    return ATSCompensationMeetingMapper.toResponse(updated);
  }
}
