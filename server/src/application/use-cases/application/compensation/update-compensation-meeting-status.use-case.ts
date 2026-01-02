import { IUpdateCompensationMeetingStatusUseCase } from 'src/domain/interfaces/use-cases/application/compensation/IUpdateCompensationMeetingStatusUseCase';
import { IATSCompensationMeetingRepository } from 'src/domain/interfaces/repositories/ats/IATSCompensationMeetingRepository';
import { IJobApplicationRepository } from 'src/domain/interfaces/repositories/job-application/IJobApplicationRepository';
import { IActivityLoggerService } from 'src/domain/interfaces/services/IActivityLoggerService';
import { ATSCompensationMeeting } from 'src/domain/entities/ats-compensation-meeting.entity';
import { ATSStage } from 'src/domain/enums/ats-stage.enum';
import { NotFoundError, ValidationError } from 'src/domain/errors/errors';

export class UpdateCompensationMeetingStatusUseCase implements IUpdateCompensationMeetingStatusUseCase {
  constructor(
    private compensationMeetingRepository: IATSCompensationMeetingRepository,
    private jobApplicationRepository: IJobApplicationRepository,
    private activityLoggerService: IActivityLoggerService,
  ) {}

  async execute(data: {
    meetingId: string;
    applicationId: string;
    status: 'scheduled' | 'completed' | 'cancelled';
    performedBy: string;
    performedByName: string;
  }): Promise<ATSCompensationMeeting> {
    if (!['scheduled', 'completed', 'cancelled'].includes(data.status)) {
      throw new ValidationError('Invalid status. Must be scheduled, completed, or cancelled');
    }

    const meeting = await this.compensationMeetingRepository.findById(data.meetingId);
    if (!meeting) {
      throw new NotFoundError('Meeting not found');
    }

    if (meeting.applicationId !== data.applicationId) {
      throw new ValidationError('Meeting does not belong to this application');
    }

    
    const application = await this.jobApplicationRepository.findById(data.applicationId);
    if (!application) {
      throw new NotFoundError('Application not found');
    }

    const updateData: Partial<ATSCompensationMeeting> & { status: 'scheduled' | 'completed' | 'cancelled'; completedAt?: Date } = {
      status: data.status,
    };

    if (data.status === 'completed') {
      updateData.completedAt = new Date();
    }

    const updated = await this.compensationMeetingRepository.update(data.meetingId, updateData);

    if (!updated) {
      throw new NotFoundError('Failed to update meeting status');
    }

    
    await this.activityLoggerService.logCompensationMeetingActivity({
      applicationId: data.applicationId,
      meetingId: updated.id,
      type: 'status_updated',
      status: data.status,
      stage: ATSStage.COMPENSATION,
      subStage: application.subStage,
      performedBy: data.performedBy,
      performedByName: data.performedByName,
    });

    return updated;
  }
}

