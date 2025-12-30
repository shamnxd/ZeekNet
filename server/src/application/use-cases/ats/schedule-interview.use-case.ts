import { v4 as uuidv4 } from 'uuid';
import { IScheduleInterviewUseCase } from '../../../domain/interfaces/use-cases/ats/IScheduleInterviewUseCase';
import { IATSInterviewRepository } from '../../../domain/interfaces/repositories/ats/IATSInterviewRepository';
import { IJobApplicationRepository } from '../../../domain/interfaces/repositories/job-application/IJobApplicationRepository';
import { IActivityLoggerService } from '../../../domain/interfaces/services/IActivityLoggerService';
import { ATSInterview } from '../../../domain/entities/ats-interview.entity';
import { NotFoundError } from '../../../domain/errors/errors';

export class ScheduleInterviewUseCase implements IScheduleInterviewUseCase {
  constructor(
    private interviewRepository: IATSInterviewRepository,
    private jobApplicationRepository: IJobApplicationRepository,
    private activityLoggerService: IActivityLoggerService,
  ) {}

  async execute(data: {
    applicationId: string;
    title: string;
    scheduledDate: Date;
    type: 'online' | 'offline';
    meetingLink?: string;
    location?: string;
    performedBy: string;
    performedByName: string;
  }): Promise<ATSInterview> {
    // Create interview
    const interview = ATSInterview.create({
      id: uuidv4(),
      applicationId: data.applicationId,
      title: data.title,
      scheduledDate: data.scheduledDate,
      type: data.type,
      meetingLink: data.meetingLink,
      location: data.location,
      status: 'scheduled',
    });

    const savedInterview = await this.interviewRepository.create(interview);

    // Get application to get current stage and subStage
    const application = await this.jobApplicationRepository.findById(data.applicationId);
    if (!application) {
      throw new NotFoundError('Application not found');
    }

    // Log activity
    await this.activityLoggerService.logInterviewScheduledActivity({
      applicationId: data.applicationId,
      interviewId: savedInterview.id,
      interviewTitle: data.title,
      interviewType: data.type,
      scheduledDate: data.scheduledDate,
      stage: application.stage,
      subStage: application.subStage,
      performedBy: data.performedBy,
      performedByName: data.performedByName,
    });

    return savedInterview;
  }
}
