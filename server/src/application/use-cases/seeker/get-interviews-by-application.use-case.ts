import { IJobApplicationRepository } from '../../../domain/interfaces/repositories/job-application/IJobApplicationRepository';
import { IATSInterviewRepository } from '../../../domain/interfaces/repositories/ats/IATSInterviewRepository';
import { NotFoundError, AuthorizationError } from '../../../domain/errors/errors';

export interface InterviewForSeekerDto {
  id: string;
  applicationId: string;
  title: string;
  scheduledDate: Date;
  type: string;
  videoType?: string;
  webrtcRoomId?: string;
  meetingLink?: string;
  location?: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IGetInterviewsByApplicationUseCase {
  execute(userId: string, applicationId: string): Promise<InterviewForSeekerDto[]>;
}

export class GetInterviewsByApplicationUseCase implements IGetInterviewsByApplicationUseCase {
  constructor(
    private readonly _jobApplicationRepository: IJobApplicationRepository,
    private readonly _interviewRepository: IATSInterviewRepository,
  ) {}

  async execute(userId: string, applicationId: string): Promise<InterviewForSeekerDto[]> {
    const application = await this._jobApplicationRepository.findById(applicationId);
    
    if (!application) {
      throw new NotFoundError('Application not found');
    }

    if (application.seekerId !== userId) {
      throw new AuthorizationError('You can only view your own applications');
    }

    const interviews = await this._interviewRepository.findByApplicationId(applicationId);
    
    return interviews.map(interview => ({
      id: interview.id,
      applicationId: interview.applicationId,
      title: interview.title,
      scheduledDate: interview.scheduledDate,
      type: interview.type,
      videoType: interview.videoType,
      webrtcRoomId: interview.webrtcRoomId,
      meetingLink: interview.meetingLink,
      location: interview.location,
      status: interview.status,
      createdAt: interview.createdAt,
      updatedAt: interview.updatedAt,
    }));
  }
}
