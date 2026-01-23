import { Response } from 'express';
import { AuthenticatedRequest } from 'src/shared/types/authenticated-request';
import { IScheduleInterviewUseCase } from 'src/domain/interfaces/use-cases/application/interview/IScheduleInterviewUseCase';
import { IUpdateInterviewUseCase } from 'src/domain/interfaces/use-cases/application/interview/IUpdateInterviewUseCase';
import { IGetInterviewsByApplicationUseCase } from 'src/domain/interfaces/use-cases/application/interview/IGetInterviewsByApplicationUseCase';
import { sendSuccessResponse, sendCreatedResponse, sendNotFoundResponse, sendInternalServerErrorResponse, extractUserId } from 'src/shared/utils/presentation/controller.utils';
import { ScheduleInterviewDto } from 'src/application/dtos/application/interview/requests/schedule-interview.dto';
import { UpdateInterviewDto } from 'src/application/dtos/application/interview/requests/update-interview.dto';

export class ATSInterviewController {
  constructor(
    private scheduleInterviewUseCase: IScheduleInterviewUseCase,
    private updateInterviewUseCase: IUpdateInterviewUseCase,
    private getInterviewsByApplicationUseCase: IGetInterviewsByApplicationUseCase,
  ) { }

  scheduleInterview = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const dto: ScheduleInterviewDto = req.body;
      const userId = extractUserId(req);
      const userName = req.user?.email || 'Unknown User';

      if (!userId) {
        sendInternalServerErrorResponse(res, 'User not authenticated');
        return;
      }


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
      const userId = extractUserId(req);
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
