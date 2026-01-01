import { Response } from 'express';
import { AuthenticatedRequest } from 'src/shared/types/authenticated-request';
import { IGetApplicationActivitiesPaginatedUseCase } from 'src/domain/interfaces/use-cases/application/activity/IGetApplicationActivitiesPaginatedUseCase';
import { sendSuccessResponse, sendInternalServerErrorResponse } from 'src/shared/utils/presentation/controller.utils';

export class ATSActivityController {
  constructor(
    private getApplicationActivitiesPaginatedUseCase: IGetApplicationActivitiesPaginatedUseCase,
  ) {}

  getActivitiesByApplication = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { applicationId } = req.params;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;
      const cursor = req.query.cursor as string | undefined;

      
      let parsedCursor: { createdAt: Date; _id: string } | undefined;
      if (cursor) {
        try {
          const [createdAtStr, id] = cursor.split('_');
          if (createdAtStr && id) {
            parsedCursor = {
              createdAt: new Date(parseInt(createdAtStr, 10)),
              _id: id,
            };
          }
        } catch (err) {
          
        }
      }

      const result = await this.getApplicationActivitiesPaginatedUseCase.execute({
        applicationId,
        limit: Math.min(limit, 100), 
        cursor: parsedCursor,
      });

      
      const nextCursor = result.nextCursor
        ? `${result.nextCursor.createdAt.getTime()}_${result.nextCursor._id}`
        : null;

      sendSuccessResponse(res, 'Activities retrieved successfully', {
        activities: result.activities,
        nextCursor,
        hasMore: result.hasMore,
      });
    } catch (error) {
      console.error('Error fetching activities:', error);
      sendInternalServerErrorResponse(res, 'Failed to fetch activities');
    }
  };
}


