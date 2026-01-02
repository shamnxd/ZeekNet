import { Response } from 'express';
import { AuthenticatedRequest } from '../../../shared/types/authenticated-request';
import { IScheduleInterviewUseCase } from '../../../domain/interfaces/use-cases/ats/IScheduleInterviewUseCase';
import { IUpdateInterviewUseCase } from '../../../domain/interfaces/use-cases/ats/IUpdateInterviewUseCase';
import { IGetInterviewsByApplicationUseCase } from '../../../domain/interfaces/use-cases/ats/IGetInterviewsByApplicationUseCase';
import { IFileUrlService } from '../../../domain/interfaces/services/IFileUrlService';
import { sendSuccessResponse, sendCreatedResponse, sendNotFoundResponse, sendInternalServerErrorResponse } from '../../../shared/utils/controller.utils';
import { ScheduleInterviewDto } from '../../../application/dto/ats/schedule-interview.dto';
import { UpdateInterviewDto } from '../../../application/dto/ats/update-interview.dto';

export class ATSInterviewController {
  constructor(
    private scheduleInterviewUseCase: IScheduleInterviewUseCase,
    private updateInterviewUseCase: IUpdateInterviewUseCase,
    private getInterviewsByApplicationUseCase: IGetInterviewsByApplicationUseCase,
    private fileUrlService: IFileUrlService,
  ) {}

  scheduleInterview = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const dto: ScheduleInterviewDto = req.body;
      const userId = req.user?.id;
      const userName = req.user?.email || 'Unknown User';

      if (!userId) {
        sendInternalServerErrorResponse(res, 'User not authenticated');
        return;
      }

      // Parse date string to Date object
      const scheduledDate = typeof dto.scheduledDate === 'string' 
        ? new Date(dto.scheduledDate) 
        : dto.scheduledDate;

      const interview = await this.scheduleInterviewUseCase.execute({
        applicationId: dto.applicationId,
        title: dto.title,
        scheduledDate,
        type: dto.type,
        videoType: dto.videoType,
        webrtcRoomId: dto.webrtcRoomId,
        meetingLink: dto.meetingLink,
        location: dto.location,
        performedBy: userId,
        performedByName: userName,
      });

      sendCreatedResponse(res, 'Interview scheduled successfully', interview);
    } catch (error) {
      console.error('Error scheduling interview:', error);
      sendInternalServerErrorResponse(res, 'Failed to schedule interview');
    }
  };

  updateInterview = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const dto: UpdateInterviewDto = req.body;
      const userId = req.user?.id;
      const userName = req.user?.email || 'Unknown User';

      if (!userId) {
        sendInternalServerErrorResponse(res, 'User not authenticated');
        return;
      }

      const interview = await this.updateInterviewUseCase.execute({
        interviewId: id,
        status: dto.status,
        rating: dto.rating,
        feedback: dto.feedback,
        performedBy: userId,
        performedByName: userName,
      });

      sendSuccessResponse(res, 'Interview updated successfully', interview);
    } catch (error) {
      console.error('Error updating interview:', error);
      if (error instanceof Error && error.message.includes('not found')) {
        sendNotFoundResponse(res, error.message);
        return;
      }
      sendInternalServerErrorResponse(res, 'Failed to update interview');
    }
  };

  getInterviewsByApplication = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { applicationId } = req.params;

      const interviews = await this.getInterviewsByApplicationUseCase.execute(applicationId);

      sendSuccessResponse(res, 'Interviews retrieved successfully', interviews);
    } catch (error) {
      console.error('Error fetching interviews:', error);
      sendInternalServerErrorResponse(res, 'Failed to fetch interviews');
    }
  };
}

