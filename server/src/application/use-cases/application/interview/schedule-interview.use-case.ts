import { v4 as uuidv4 } from 'uuid';
import { IScheduleInterviewUseCase } from 'src/domain/interfaces/use-cases/application/interview/IScheduleInterviewUseCase';
import { IATSInterviewRepository } from 'src/domain/interfaces/repositories/ats/IATSInterviewRepository';
import { IJobApplicationRepository } from 'src/domain/interfaces/repositories/job-application/IJobApplicationRepository';
import { IActivityLoggerService } from 'src/domain/interfaces/services/IActivityLoggerService';
import { ATSInterview } from 'src/domain/entities/ats-interview.entity';
import { NotFoundError } from 'src/domain/errors/errors';

import { IJobPostingRepository } from 'src/domain/interfaces/repositories/job/IJobPostingRepository';
import { IUserRepository } from 'src/domain/interfaces/repositories/user/IUserRepository';
import { IMailerService } from 'src/domain/interfaces/services/IMailerService';
import { IEmailTemplateService } from 'src/domain/interfaces/services/IEmailTemplateService';

export class ScheduleInterviewUseCase implements IScheduleInterviewUseCase {
  constructor(
    private interviewRepository: IATSInterviewRepository,
    private jobApplicationRepository: IJobApplicationRepository,
    private jobPostingRepository: IJobPostingRepository,
    private userRepository: IUserRepository,
    private activityLoggerService: IActivityLoggerService,
    private mailerService: IMailerService,
    private emailTemplateService: IEmailTemplateService,
  ) {}

  async execute(data: {
    applicationId: string;
    title: string;
    scheduledDate: Date;
    type: 'online' | 'offline';
    videoType?: 'in-app' | 'external';
    webrtcRoomId?: string;
    meetingLink?: string;
    location?: string;
    performedBy: string;
    performedByName: string;
  }): Promise<ATSInterview> {
    
    let webrtcRoomId = data.webrtcRoomId;
    if (data.type === 'online' && data.videoType === 'in-app' && !webrtcRoomId) {
      webrtcRoomId = uuidv4();
    }

    
    const interview = ATSInterview.create({
      id: uuidv4(),
      applicationId: data.applicationId,
      title: data.title,
      scheduledDate: data.scheduledDate,
      type: data.type,
      videoType: data.videoType,
      webrtcRoomId,
      meetingLink: data.meetingLink,
      location: data.location,
      status: 'scheduled',
    });

    const savedInterview = await this.interviewRepository.create(interview);

    
    const application = await this.jobApplicationRepository.findById(data.applicationId);
    if (!application) {
      throw new NotFoundError('Application not found');
    }

    const job = await this.jobPostingRepository.findById(application.jobId);
    if (job && application.seekerId) {
        await this._sendInterviewScheduledEmail(
            application.seekerId, 
            job.title, 
            job.companyName || 'ZeekNet', 
            data.scheduledDate, 
            data.type
        );
    }

    
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

  private async _sendInterviewScheduledEmail(
    seekerId: string,
    jobTitle: string,
    companyName: string,
    date: Date,
    type: string,
  ): Promise<void> {
    try {
      const user = await this.userRepository.findById(seekerId);
      if (!user) return;

      const dateStr = date.toLocaleDateString();
      const timeStr = date.toLocaleTimeString();

      const { subject, html } = this.emailTemplateService.getInterviewScheduledEmail(
        user.name,
        jobTitle,
        companyName,
        dateStr,
        timeStr,
        type,
      );
      await this.mailerService.sendMail(user.email, subject, html);
    } catch (error) {
      console.error('Failed to send interview scheduled email:', error);
    }
  }
}
