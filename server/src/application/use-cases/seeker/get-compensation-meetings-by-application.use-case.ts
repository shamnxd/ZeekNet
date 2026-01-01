import { IJobApplicationRepository } from '../../../domain/interfaces/repositories/job-application/IJobApplicationRepository';
import { IATSCompensationMeetingRepository } from '../../../domain/interfaces/repositories/ats/IATSCompensationMeetingRepository';
import { NotFoundError, AuthorizationError } from '../../../domain/errors/errors';

export interface CompensationMeetingForSeekerDto {
  id: string;
  applicationId: string;
  type: string;
  scheduledDate: Date;
  location?: string;
  meetingLink?: string;
  status: string;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IGetCompensationMeetingsByApplicationUseCase {
  execute(userId: string, applicationId: string): Promise<CompensationMeetingForSeekerDto[]>;
}

export class GetCompensationMeetingsByApplicationUseCase implements IGetCompensationMeetingsByApplicationUseCase {
  constructor(
    private readonly _jobApplicationRepository: IJobApplicationRepository,
    private readonly _compensationMeetingRepository: IATSCompensationMeetingRepository,
  ) {}

  async execute(userId: string, applicationId: string): Promise<CompensationMeetingForSeekerDto[]> {
    const application = await this._jobApplicationRepository.findById(applicationId);
    
    if (!application) {
      throw new NotFoundError('Application not found');
    }

    if (application.seekerId !== userId) {
      throw new AuthorizationError('You can only view your own applications');
    }

    const meetings = await this._compensationMeetingRepository.findByApplicationId(applicationId);
    
    return meetings.map(meeting => ({
      id: meeting.id,
      applicationId: meeting.applicationId,
      type: meeting.type,
      scheduledDate: meeting.scheduledDate,
      location: meeting.location,
      meetingLink: meeting.meetingLink,
      status: meeting.status,
      completedAt: meeting.completedAt,
      createdAt: meeting.createdAt,
      updatedAt: meeting.updatedAt,
    }));
  }
}
