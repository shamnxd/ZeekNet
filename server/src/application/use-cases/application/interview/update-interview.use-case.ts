import { IUpdateInterviewUseCase } from 'src/domain/interfaces/use-cases/application/interview/IUpdateInterviewUseCase';
import { IATSInterviewRepository } from 'src/domain/interfaces/repositories/ats/IATSInterviewRepository';
import { IJobApplicationRepository } from 'src/domain/interfaces/repositories/job-application/IJobApplicationRepository';
import { IActivityLoggerService } from 'src/domain/interfaces/services/IActivityLoggerService';
import { IUserRepository } from 'src/domain/interfaces/repositories/user/IUserRepository';
import { ATSInterview } from 'src/domain/entities/ats-interview.entity';
import { NotFoundError } from 'src/domain/errors/errors';
import { UpdateInterviewRequestDto } from 'src/application/dtos/application/interview/requests/update-interview.dto';
import { ATSInterviewResponseDto } from 'src/application/dtos/application/interview/responses/ats-interview-response.dto';
import { ATSInterviewMapper } from 'src/application/mappers/ats/ats-interview.mapper';

export class UpdateInterviewUseCase implements IUpdateInterviewUseCase {
  constructor(
    private interviewRepository: IATSInterviewRepository,
    private jobApplicationRepository: IJobApplicationRepository,
    private activityLoggerService: IActivityLoggerService,
    private userRepository: IUserRepository,
  ) {}

  async execute(data: UpdateInterviewRequestDto): Promise<ATSInterviewResponseDto> {
    // Get user info for audit fields
    const user = await this.userRepository.findById(data.userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    const performedBy = data.userId;
    const performedByName = user.email || user.name || 'Unknown User';
    
    const existingInterview = await this.interviewRepository.findById(data.interviewId);
    if (!existingInterview) {
      throw new NotFoundError('Interview not found');
    }

    const interview = await this.interviewRepository.update(data.interviewId, {
      status: data.status,
      rating: data.rating,
      feedback: data.feedback,
    });

    if (!interview) {
      throw new NotFoundError('Interview not found');
    }

    
    const application = await this.jobApplicationRepository.findById(existingInterview.applicationId);
    if (application) {
      await this.activityLoggerService.logInterviewActivity({
        applicationId: existingInterview.applicationId,
        interviewId: interview.id,
        interviewTitle: interview.title,
        status: data.status === 'scheduled' ? undefined : data.status,
        rating: data.rating,
        feedback: data.feedback,
        stage: application.stage,
        subStage: application.subStage,
        performedBy,
        performedByName,
      });
    }

    return interview;
  }
}

