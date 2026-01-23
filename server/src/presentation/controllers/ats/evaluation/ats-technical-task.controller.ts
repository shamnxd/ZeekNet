import { Response } from 'express';
import { AuthenticatedRequest } from 'src/shared/types/authenticated-request';
import { IAssignTechnicalTaskUseCase } from 'src/domain/interfaces/use-cases/application/task/IAssignTechnicalTaskUseCase';
import { IUpdateTechnicalTaskUseCase } from 'src/domain/interfaces/use-cases/application/task/IUpdateTechnicalTaskUseCase';
import { IDeleteTechnicalTaskUseCase } from 'src/domain/interfaces/use-cases/application/task/IDeleteTechnicalTaskUseCase';
import { IGetTechnicalTasksByApplicationUseCase } from 'src/domain/interfaces/use-cases/application/task/IGetTechnicalTasksByApplicationUseCase';
import { IS3Service } from 'src/domain/interfaces/services/IS3Service';
import { IFileUploadService } from 'src/domain/interfaces/services/IFileUploadService';
import { UploadedFile } from 'src/domain/types/common.types';
import { sendSuccessResponse, sendCreatedResponse, sendNotFoundResponse, sendInternalServerErrorResponse, extractUserId } from 'src/shared/utils/presentation/controller.utils';
import { AssignTechnicalTaskDto } from 'src/application/dtos/application/task/requests/assign-technical-task.dto';
import { UpdateTechnicalTaskDto } from 'src/application/dtos/application/task/requests/update-technical-task.dto';

export class ATSTechnicalTaskController {
  constructor(
    private _assignTechnicalTaskUseCase: IAssignTechnicalTaskUseCase,
    private _updateTechnicalTaskUseCase: IUpdateTechnicalTaskUseCase,
    private _deleteTechnicalTaskUseCase: IDeleteTechnicalTaskUseCase,
    private _getTechnicalTasksByApplicationUseCase: IGetTechnicalTasksByApplicationUseCase,
    private _s3Service: IS3Service,
    private _fileUploadService: IFileUploadService,
  ) { }

  assignTechnicalTask = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const dto: AssignTechnicalTaskDto = req.body;
      const userId = extractUserId(req);
      const userName = req.user?.email || 'Unknown User';

      if (!userId) {
        sendInternalServerErrorResponse(res, 'User not authenticated');
        return;
      }


      let documentUrl: string | undefined;
      let documentFilename: string | undefined;

      if (req.file) {
        const uploadResult = await this._fileUploadService.uploadTaskDocument(req.file as unknown as UploadedFile, 'document');
        documentUrl = uploadResult.url;
        documentFilename = uploadResult.filename;
      } else if (dto.documentUrl && dto.documentFilename) {

        documentUrl = dto.documentUrl;
        documentFilename = dto.documentFilename;
      }


      const deadline = typeof dto.deadline === 'string'
        ? new Date(dto.deadline)
        : dto.deadline;

      const task = await this._assignTechnicalTaskUseCase.execute({
        applicationId: dto.applicationId,
        title: dto.title,
        description: dto.description,
        deadline,
        documentUrl,
        documentFilename,
        performedBy: userId,
        performedByName: userName,
      });


      let taskWithSignedUrl = { ...task };
      if (task.documentUrl) {
        const signedUrl = await this._s3Service.getSignedUrl(task.documentUrl);
        taskWithSignedUrl = {
          ...task,
          documentUrl: signedUrl,
        };
      }

      sendCreatedResponse(res, 'Technical task assigned successfully', taskWithSignedUrl);
    } catch (error) {
      console.error('Error assigning technical task:', error);
      sendInternalServerErrorResponse(res, 'Failed to assign technical task');
    }
  };

  updateTechnicalTask = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const dto: UpdateTechnicalTaskDto = req.body;
      const userId = extractUserId(req);
      const userName = req.user?.email || 'Unknown User';

      if (!userId) {
        sendInternalServerErrorResponse(res, 'User not authenticated');
        return;
      }


      const deadline = dto.deadline ? new Date(dto.deadline) : undefined;


      let documentUrl: string | undefined;
      let documentFilename: string | undefined;

      if (req.file) {
        const uploadResult = await this._fileUploadService.uploadTaskDocument(req.file as unknown as UploadedFile, 'document');
        documentUrl = uploadResult.url;
        documentFilename = uploadResult.filename;
      }

      const task = await this._updateTechnicalTaskUseCase.execute({
        taskId: id,
        title: dto.title,
        description: dto.description,
        deadline,
        documentUrl,
        documentFilename,
        status: dto.status,
        rating: dto.rating,
        feedback: dto.feedback,
        performedBy: userId,
        performedByName: userName,
      });


      let taskWithSignedUrl = { ...task };
      if (task.documentUrl) {
        const signedUrl = await this._s3Service.getSignedUrl(task.documentUrl);
        taskWithSignedUrl = {
          ...taskWithSignedUrl,
          documentUrl: signedUrl,
        };
      }
      if (task.submissionUrl) {
        const submissionSignedUrl = await this._s3Service.getSignedUrl(task.submissionUrl);
        taskWithSignedUrl = {
          ...taskWithSignedUrl,
          submissionUrl: submissionSignedUrl,
        };
      }

      sendSuccessResponse(res, 'Technical task updated successfully', taskWithSignedUrl);
    } catch (error) {
      console.error('Error updating technical task:', error);
      if (error instanceof Error && error.message.includes('not found')) {
        sendNotFoundResponse(res, error.message);
        return;
      }
      sendInternalServerErrorResponse(res, 'Failed to update technical task');
    }
  };

  getTechnicalTasksByApplication = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { applicationId } = req.params;

      const tasks = await this._getTechnicalTasksByApplicationUseCase.execute(applicationId);


      const tasksWithSignedUrls = await Promise.all(
        tasks.map(async (task) => {
          const taskObj: typeof task & { documentUrl?: string; submissionUrl?: string } = { ...task };

          if (task.documentUrl) {
            taskObj.documentUrl = await this._s3Service.getSignedUrl(task.documentUrl);
          }

          if (task.submissionUrl) {
            taskObj.submissionUrl = await this._s3Service.getSignedUrl(task.submissionUrl);
          }

          return taskObj;
        }),
      );

      sendSuccessResponse(res, 'Technical tasks retrieved successfully', tasksWithSignedUrls);
    } catch (error) {
      console.error('Error fetching technical tasks:', error);
      sendInternalServerErrorResponse(res, 'Failed to fetch technical tasks');
    }
  };

  deleteTechnicalTask = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = extractUserId(req);
      const userName = req.user?.email || 'Unknown User';

      if (!userId) {
        sendInternalServerErrorResponse(res, 'User not authenticated');
        return;
      }

      await this._deleteTechnicalTaskUseCase.execute({
        taskId: id,
        performedBy: userId,
        performedByName: userName,
      });

      sendSuccessResponse(res, 'Technical task deleted successfully', { id });
    } catch (error) {
      console.error('Error deleting technical task:', error);
      if (error instanceof Error && error.message.includes('not found')) {
        sendNotFoundResponse(res, error.message);
        return;
      }
      sendInternalServerErrorResponse(res, 'Failed to delete technical task');
    }
  };
}



