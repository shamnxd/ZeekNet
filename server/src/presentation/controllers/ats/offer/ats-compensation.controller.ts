import { Response, NextFunction } from 'express';
import { z } from 'zod';

import { IInitiateCompensationUseCase } from 'src/domain/interfaces/use-cases/application/compensation/IInitiateCompensationUseCase';
import { IUpdateCompensationUseCase } from 'src/domain/interfaces/use-cases/application/compensation/IUpdateCompensationUseCase';
import { IGetCompensationUseCase } from 'src/domain/interfaces/use-cases/application/compensation/IGetCompensationUseCase';
import { IScheduleCompensationMeetingUseCase } from 'src/domain/interfaces/use-cases/application/compensation/IScheduleCompensationMeetingUseCase';
import { IGetCompensationMeetingsUseCase } from 'src/domain/interfaces/use-cases/application/compensation/IGetCompensationMeetingsUseCase';
import { IUpdateCompensationMeetingStatusUseCase } from 'src/domain/interfaces/use-cases/application/compensation/IUpdateCompensationMeetingStatusUseCase';

import { AuthenticatedRequest } from 'src/shared/types/authenticated-request';
import { sendSuccessResponse, sendCreatedResponse, validateUserId, handleValidationError, handleAsyncError } from 'src/shared/utils/presentation/controller.utils';
import { formatZodErrors } from 'src/shared/utils/presentation/zod-error-formatter.util';
import { InitiateCompensationSchema } from 'src/application/dtos/application/compensation/requests/initiate-compensation.dto';
import { UpdateCompensationSchema } from 'src/application/dtos/application/compensation/requests/update-compensation.dto';
import { ScheduleCompensationMeetingSchema } from 'src/application/dtos/application/compensation/requests/schedule-compensation-meeting.dto';
import { UpdateCompensationMeetingStatusSchema } from 'src/application/dtos/application/compensation/requests/update-compensation-meeting-status.dto';

export class ATSCompensationController {
  constructor(
    private readonly _initiateCompensationUseCase: IInitiateCompensationUseCase,
    private readonly _updateCompensationUseCase: IUpdateCompensationUseCase,
    private readonly _getCompensationUseCase: IGetCompensationUseCase,
    private readonly _scheduleCompensationMeetingUseCase: IScheduleCompensationMeetingUseCase,
    private readonly _getCompensationMeetingsUseCase: IGetCompensationMeetingsUseCase,
    private readonly _updateCompensationMeetingStatusUseCase: IUpdateCompensationMeetingStatusUseCase,
  ) { }

  initiateCompensation = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const validation = InitiateCompensationSchema.safeParse(req.body);
    if (!validation.success) {
      return handleValidationError(formatZodErrors(validation.error), next);
    }

    try {
      const { applicationId } = req.params;
      const userId = validateUserId(req);

      const created = await this._initiateCompensationUseCase.execute({
        applicationId,
        ...validation.data,
        performedBy: userId,
      });

      sendCreatedResponse(res, 'Compensation discussion initiated successfully', created);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  updateCompensation = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const validation = UpdateCompensationSchema.safeParse(req.body);
    if (!validation.success) {
      return handleValidationError(formatZodErrors(validation.error), next);
    }

    try {
      const { applicationId } = req.params;
      const userId = validateUserId(req);

      const updated = await this._updateCompensationUseCase.execute({
        applicationId,
        ...validation.data,
        performedBy: userId,
      });

      sendSuccessResponse(res, 'Compensation updated successfully', updated);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getCompensation = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { applicationId } = req.params;

      const compensation = await this._getCompensationUseCase.execute(applicationId);

      if (!compensation) {
        throw new Error('Compensation record not found');
      }

      sendSuccessResponse(res, 'Compensation retrieved successfully', compensation);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  scheduleCompensationMeeting = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const validation = ScheduleCompensationMeetingSchema.safeParse(req.body);
    if (!validation.success) {
      return handleValidationError(formatZodErrors(validation.error), next);
    }

    try {
      const { applicationId } = req.params;
      const userId = validateUserId(req);

      const created = await this._scheduleCompensationMeetingUseCase.execute({
        applicationId,
        ...validation.data,
        performedBy: userId,
      });

      sendCreatedResponse(res, 'Compensation meeting scheduled successfully', created);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getCompensationMeetings = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { applicationId } = req.params;

      const meetings = await this._getCompensationMeetingsUseCase.execute(applicationId);

      sendSuccessResponse(res, 'Compensation meetings retrieved successfully', meetings);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  updateCompensationMeetingStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const validation = UpdateCompensationMeetingStatusSchema.safeParse(req.body);
    if (!validation.success) {
      return handleValidationError(formatZodErrors(validation.error), next);
    }

    try {
      const { applicationId, meetingId } = req.params;
      const userId = validateUserId(req);

      const updated = await this._updateCompensationMeetingStatusUseCase.execute({
        meetingId,
        applicationId,
        status: validation.data.status,
        performedBy: userId,
      });

      sendSuccessResponse(res, 'Meeting status updated successfully', updated);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}



