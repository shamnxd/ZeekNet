import { v4 as uuidv4 } from 'uuid';
import { IScheduleInterviewUseCase } from 'src/domain/interfaces/use-cases/application/interview/IScheduleInterviewUseCase';
import { IATSInterviewRepository } from 'src/domain/interfaces/repositories/ats/IATSInterviewRepository';
import { IJobApplicationRepository } from 'src/domain/interfaces/repositories/job-application/IJobApplicationRepository';

import { ATSInterview } from 'src/domain/entities/ats-interview.entity';
import { NotFoundError } from 'src/domain/errors/errors';
import { IJobPostingRepository } from 'src/domain/interfaces/repositories/job/IJobPostingRepository';
import { IUserRepository } from 'src/domain/interfaces/repositories/user/IUserRepository';
import { IMailerService } from 'src/domain/interfaces/services/IMailerService';
import { IEmailTemplateService } from 'src/domain/interfaces/services/IEmailTemplateService';
import { ScheduleInterviewRequestDto } from 'src/application/dtos/application/interview/requests/schedule-interview.dto';
import { ATSInterviewResponseDto } from 'src/application/dtos/application/interview/responses/ats-interview-response.dto';
import { ATSInterviewMapper } from 'src/application/mappers/ats/ats-interview.mapper';
import { ILogger } from 'src/domain/interfaces/services/ILogger';

export class ScheduleInterviewUseCase implements IScheduleInterviewUseCase {
  constructor(
    private interviewRepository: IATSInterviewRepository,
    private jobApplicationRepository: IJobApplicationRepository,
    private jobPostingRepository: IJobPostingRepository,
    private userRepository: IUserRepository,

    private mailerService: IMailerService,
    private emailTemplateService: IEmailTemplateService,
    private logger: ILogger,
  ) { }

  async execute(data: ScheduleInterviewRequestDto): Promise<ATSInterviewResponseDto> {
    // Convert date if needed
    const scheduledDate = typeof data.scheduledDate === 'string'
      ? new Date(data.scheduledDate)
      : data.scheduledDate;

    // Get user info for audit fields
    const user = await this.userRepository.findById(data.userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    const performedBy = data.userId;
    const performedByName = user.email || user.name || 'Unknown User';

    let webrtcRoomId = data.webrtcRoomId;
    if (data.type === 'online' && data.videoType === 'in-app' && !webrtcRoomId) {
      webrtcRoomId = uuidv4();
    }

    const interview = ATSInterview.create({
      id: uuidv4(),
      applicationId: data.applicationId,
      title: data.title,
      scheduledDate,
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
        scheduledDate,
        data.type,
      );
    }



    return ATSInterviewMapper.toResponse(savedInterview);
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
      this.logger.error('Failed to send interview scheduled email:', error);
    }
  }
}
