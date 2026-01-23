import { Response } from 'express';
import { AuthenticatedRequest } from 'src/shared/types/authenticated-request';
import { IInitiateCompensationUseCase } from 'src/domain/interfaces/use-cases/application/compensation/IInitiateCompensationUseCase';
import { IUpdateCompensationUseCase } from 'src/domain/interfaces/use-cases/application/compensation/IUpdateCompensationUseCase';
import { IGetCompensationUseCase } from 'src/domain/interfaces/use-cases/application/compensation/IGetCompensationUseCase';
import { IScheduleCompensationMeetingUseCase } from 'src/domain/interfaces/use-cases/application/compensation/IScheduleCompensationMeetingUseCase';
import { IGetCompensationMeetingsUseCase } from 'src/domain/interfaces/use-cases/application/compensation/IGetCompensationMeetingsUseCase';
import { IUpdateCompensationMeetingStatusUseCase } from 'src/domain/interfaces/use-cases/application/compensation/IUpdateCompensationMeetingStatusUseCase';
import { sendSuccessResponse, sendCreatedResponse, sendBadRequestResponse, sendNotFoundResponse, sendInternalServerErrorResponse, extractUserId } from 'src/shared/utils/presentation/controller.utils';
import { InitiateCompensationDto } from 'src/application/dtos/application/compensation/requests/initiate-compensation.dto';
import { UpdateCompensationDto } from 'src/application/dtos/application/compensation/requests/update-compensation.dto';
import { ScheduleCompensationMeetingDto } from 'src/application/dtos/application/compensation/requests/schedule-compensation-meeting.dto';

export class ATSCompensationController {
  constructor(
    private _initiateCompensationUseCase: IInitiateCompensationUseCase,
    private _updateCompensationUseCase: IUpdateCompensationUseCase,
    private _getCompensationUseCase: IGetCompensationUseCase,
    private _scheduleCompensationMeetingUseCase: IScheduleCompensationMeetingUseCase,
    private _getCompensationMeetingsUseCase: IGetCompensationMeetingsUseCase,
    private _updateCompensationMeetingStatusUseCase: IUpdateCompensationMeetingStatusUseCase,
  ) { }

  initiateCompensation = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { applicationId } = req.params;
      const dto: InitiateCompensationDto = req.body;
      const userId = extractUserId(req);
      const userName = req.user?.email || 'Unknown User';

      if (!userId) {
        sendBadRequestResponse(res, 'User not authenticated');
        return;
      }

      const created = await this._initiateCompensationUseCase.execute({
        applicationId,
        candidateExpected: dto.candidateExpected,
        notes: dto.notes,
        performedBy: userId,
        performedByName: userName,
      });

      sendCreatedResponse(res, 'Compensation discussion initiated successfully', created);
    } catch (error) {
      console.error('Error initiating compensation:', error);
      if (error instanceof Error) {
        if (error.message.includes('not found')) {
          sendNotFoundResponse(res, error.message);
          return;
        }
        if (error.message.includes('already initiated')) {
          sendBadRequestResponse(res, error.message);
          return;
        }
      }
      sendInternalServerErrorResponse(res, 'Failed to initiate compensation discussion');
    }
  };

  updateCompensation = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { applicationId } = req.params;
      const dto: UpdateCompensationDto = req.body;
      const userId = extractUserId(req);
      const userName = req.user?.email || 'Unknown User';

      if (!userId) {
        sendBadRequestResponse(res, 'User not authenticated');
        return;
      }

      const expectedJoining = dto.expectedJoining ? new Date(dto.expectedJoining) : undefined;
      const approvedAt = dto.approvedAt ? new Date(dto.approvedAt) : undefined;

      const updated = await this._updateCompensationUseCase.execute({
        applicationId,
        candidateExpected: dto.candidateExpected,
        companyProposed: dto.companyProposed,
        expectedJoining,
        benefits: dto.benefits,
        finalAgreed: dto.finalAgreed,
        approvedAt,
        approvedBy: dto.approvedBy,
        approvedByName: dto.approvedByName,
        notes: dto.notes,
        performedBy: userId,
        performedByName: userName,
      });

      sendSuccessResponse(res, 'Compensation updated successfully', updated);
    } catch (error) {
      console.error('Error updating compensation:', error);
      if (error instanceof Error && error.message.includes('not found')) {
        sendNotFoundResponse(res, error.message);
        return;
      }
      sendInternalServerErrorResponse(res, 'Failed to update compensation');
    }
  };

  getCompensation = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { applicationId } = req.params;

      const compensation = await this._getCompensationUseCase.execute(applicationId);

      if (!compensation) {
        sendNotFoundResponse(res, 'Compensation record not found');
        return;
      }

      sendSuccessResponse(res, 'Compensation retrieved successfully', compensation);
    } catch (error) {
      console.error('Error fetching compensation:', error);
      sendInternalServerErrorResponse(res, 'Failed to fetch compensation');
    }
  };

  scheduleCompensationMeeting = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { applicationId } = req.params;
      const dto: ScheduleCompensationMeetingDto = req.body;
      const userId = extractUserId(req);
      const userName = req.user?.email || 'Unknown User';

      if (!userId) {
        sendBadRequestResponse(res, 'User not authenticated');
        return;
      }


      const scheduledDate = new Date(`${dto.date}T${dto.time}`);

      const created = await this._scheduleCompensationMeetingUseCase.execute({
        applicationId,
        type: dto.type,
        scheduledDate,
        videoType: dto.videoType,
        webrtcRoomId: dto.webrtcRoomId,
        location: dto.location,
        meetingLink: dto.meetingLink,
        notes: dto.notes,
        performedBy: userId,
        performedByName: userName,
      });

      sendCreatedResponse(res, 'Compensation meeting scheduled successfully', created);
    } catch (error) {
      console.error('Error scheduling compensation meeting:', error);
      if (error instanceof Error && error.message.includes('not found')) {
        sendNotFoundResponse(res, error.message);
        return;
      }
      sendInternalServerErrorResponse(res, 'Failed to schedule compensation meeting');
    }
  };

  getCompensationMeetings = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { applicationId } = req.params;

      const meetings = await this._getCompensationMeetingsUseCase.execute(applicationId);

      sendSuccessResponse(res, 'Compensation meetings retrieved successfully', meetings);
    } catch (error) {
      console.error('Error fetching compensation meetings:', error);
      sendInternalServerErrorResponse(res, 'Failed to fetch compensation meetings');
    }
  };

  updateCompensationMeetingStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { applicationId, meetingId } = req.params;
      const { status } = req.body;
      const userId = extractUserId(req);
      const userName = req.user?.email || 'Unknown User';

      if (!userId) {
        sendBadRequestResponse(res, 'User not authenticated');
        return;
      }

      const updated = await this._updateCompensationMeetingStatusUseCase.execute({
        meetingId,
        applicationId,
        status: status as 'scheduled' | 'completed' | 'cancelled',
        performedBy: userId,
        performedByName: userName,
      });

      sendSuccessResponse(res, 'Meeting status updated successfully', updated);
    } catch (error) {
      console.error('Error updating compensation meeting status:', error);
      if (error instanceof Error) {
        if (error.message.includes('not found')) {
          sendNotFoundResponse(res, error.message);
          return;
        }
        if (error.message.includes('Invalid status') || error.message.includes('does not belong')) {
          sendBadRequestResponse(res, error.message);
          return;
        }
      }
      sendInternalServerErrorResponse(res, 'Failed to update meeting status');
    }
  };
}



