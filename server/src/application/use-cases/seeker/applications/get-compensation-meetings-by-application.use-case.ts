import { IJobApplicationRepository } from 'src/domain/interfaces/repositories/job-application/IJobApplicationRepository';
import { IATSCompensationMeetingRepository } from 'src/domain/interfaces/repositories/ats/IATSCompensationMeetingRepository';
import { NotFoundError, AuthorizationError } from 'src/domain/errors/errors';
import {
  CompensationMeetingForSeekerDto,
  IGetCompensationMeetingsByApplicationUseCase,
} from 'src/domain/interfaces/use-cases/seeker/applications/IGetCompensationMeetingsByApplicationUseCase';

import { injectable, inject } from 'inversify';
import { TYPES } from 'src/shared/constants/types';
import { ERROR } from 'src/shared/constants/messages';

@injectable()
export class GetCompensationMeetingsByApplicationUseCase implements IGetCompensationMeetingsByApplicationUseCase {
  constructor(
    @inject(TYPES.JobApplicationRepository) private readonly _jobApplicationRepository: IJobApplicationRepository,
    @inject(TYPES.ATSCompensationMeetingRepository) private readonly _compensationMeetingRepository: IATSCompensationMeetingRepository,
  ) { }

  async execute(userId: string, applicationId: string): Promise<CompensationMeetingForSeekerDto[]> {
    const application = await this._jobApplicationRepository.findById(applicationId);

    if (!application) {
      throw new NotFoundError(ERROR.NOT_FOUND('Application'));
    }

    if (application.seekerId !== userId) {
      throw new AuthorizationError('You can only view your own applications');
    }

    const meetings = await this._compensationMeetingRepository.findByApplicationId(applicationId);

    return meetings.map(meeting => ({
      id: meeting.id,
      applicationId: meeting.applicationId,
      type: meeting.type,
      videoType: meeting.videoType as 'in-app' | 'external',
      webrtcRoomId: meeting.webrtcRoomId,
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
