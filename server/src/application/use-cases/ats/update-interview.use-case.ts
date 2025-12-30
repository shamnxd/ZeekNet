import { IUpdateInterviewUseCase } from '../../../domain/interfaces/use-cases/ats/IUpdateInterviewUseCase';
import { IATSInterviewRepository } from '../../../domain/interfaces/repositories/ats/IATSInterviewRepository';
import { IJobApplicationRepository } from '../../../domain/interfaces/repositories/job-application/IJobApplicationRepository';
import { IActivityLoggerService } from '../../../domain/interfaces/services/IActivityLoggerService';
import { ATSInterview } from '../../../domain/entities/ats-interview.entity';
import { NotFoundError } from '../../../domain/errors/errors';

export class UpdateInterviewUseCase implements IUpdateInterviewUseCase {
  constructor(
    private interviewRepository: IATSInterviewRepository,
    private jobApplicationRepository: IJobApplicationRepository,
    private activityLoggerService: IActivityLoggerService,
  ) {}

  async execute(data: {
    interviewId: string;
    status?: 'scheduled' | 'completed' | 'cancelled';
    rating?: number;
    feedback?: string;
    performedBy: string;
    performedByName: string;
  }): Promise<ATSInterview> {
    // Get interview first to get applicationId
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

    // Get application to get current stage and subStage for activity logging
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
        performedBy: data.performedBy,
        performedByName: data.performedByName,
      });
    }

    return interview;
  }
}

