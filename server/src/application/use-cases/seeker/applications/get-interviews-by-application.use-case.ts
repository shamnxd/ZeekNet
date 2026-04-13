import { IJobApplicationRepository } from 'src/domain/interfaces/repositories/job-application/IJobApplicationRepository';
import { IATSInterviewRepository } from 'src/domain/interfaces/repositories/ats/IATSInterviewRepository';
import { NotFoundError, AuthorizationError } from 'src/domain/errors/errors';
import { 
  InterviewForSeekerDto, 
  IGetInterviewsByApplicationUseCase, 
} from 'src/domain/interfaces/use-cases/seeker/applications/IGetInterviewsByApplicationUseCase';

import { injectable, inject } from 'inversify';
import { TYPES } from 'src/shared/constants/types';
import { ERROR } from 'src/shared/constants/messages';

@injectable()
export class GetInterviewsByApplicationUseCase implements IGetInterviewsByApplicationUseCase {
  constructor(
    @inject(TYPES.JobApplicationRepository) private readonly _jobApplicationRepository: IJobApplicationRepository,
    @inject(TYPES.ATSInterviewRepository) private readonly _interviewRepository: IATSInterviewRepository,
  ) {}

  async execute(userId: string, applicationId: string): Promise<InterviewForSeekerDto[]> {
    const application = await this._jobApplicationRepository.findById(applicationId);
    
    if (!application) {
      throw new NotFoundError(ERROR.NOT_FOUND('Application'));
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
