import { Response } from 'express';
import { AuthenticatedRequest } from '../../../shared/types/authenticated-request';
import { IAssignTechnicalTaskUseCase } from '../../../domain/interfaces/use-cases/ats/IAssignTechnicalTaskUseCase';
import { IUpdateTechnicalTaskUseCase } from '../../../domain/interfaces/use-cases/ats/IUpdateTechnicalTaskUseCase';
import { IDeleteTechnicalTaskUseCase } from '../../../domain/interfaces/use-cases/ats/IDeleteTechnicalTaskUseCase';
import { IGetTechnicalTasksByApplicationUseCase } from '../../../domain/interfaces/use-cases/ats/IGetTechnicalTasksByApplicationUseCase';
import { IS3Service } from '../../../domain/interfaces/services/IS3Service';
import { IFileUrlService } from '../../../domain/interfaces/services/IFileUrlService';
import { sendSuccessResponse, sendCreatedResponse, sendNotFoundResponse, sendInternalServerErrorResponse } from '../../../shared/utils/presentation/controller.utils';
import { UploadService, UploadedFile } from '../../../shared/services/upload.service';
import { AssignTechnicalTaskDto } from '../../../application/dtos/ats/common/assign-technical-task.dto';
import { UpdateTechnicalTaskDto } from '../../../application/dtos/ats/requests/update-technical-task.dto';

export class ATSTechnicalTaskController {
  constructor(
    private assignTechnicalTaskUseCase: IAssignTechnicalTaskUseCase,
    private updateTechnicalTaskUseCase: IUpdateTechnicalTaskUseCase,
    private deleteTechnicalTaskUseCase: IDeleteTechnicalTaskUseCase,
    private getTechnicalTasksByApplicationUseCase: IGetTechnicalTasksByApplicationUseCase,
    private s3Service: IS3Service,
    private fileUrlService: IFileUrlService,
  ) {}

  assignTechnicalTask = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const dto: AssignTechnicalTaskDto = req.body;
      const userId = req.user?.id;
      const userName = req.user?.email || 'Unknown User';

      if (!userId) {
        sendInternalServerErrorResponse(res, 'User not authenticated');
        return;
      }

      // Upload document to S3 if file is provided
      let documentUrl: string | undefined;
      let documentFilename: string | undefined;

      if (req.file) {
        const uploadResult = await UploadService.handleTaskDocumentUpload(req.file as unknown as UploadedFile, this.s3Service, 'document');
        documentUrl = uploadResult.url; // This is the S3 key
        documentFilename = uploadResult.filename;
      } else if (dto.documentUrl && dto.documentFilename) {
        // Fallback to provided URL if no file uploaded (for backward compatibility)
        documentUrl = dto.documentUrl;
        documentFilename = dto.documentFilename;
      }

      // Parse deadline string to Date object
      const deadline = typeof dto.deadline === 'string' 
        ? new Date(dto.deadline) 
        : dto.deadline;

      const task = await this.assignTechnicalTaskUseCase.execute({
        applicationId: dto.applicationId,
        title: dto.title,
        description: dto.description,
        deadline,
        documentUrl,
        documentFilename,
        performedBy: userId,
        performedByName: userName,
      });

      // Generate signed URL for document if it exists
      let taskWithSignedUrl = { ...task };
      if (task.documentUrl) {
        const signedUrl = await this.fileUrlService.getSignedUrl(task.documentUrl);
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
      const userId = req.user?.id;
      const userName = req.user?.email || 'Unknown User';

      if (!userId) {
        sendInternalServerErrorResponse(res, 'User not authenticated');
        return;
      }

      // Convert deadline string to Date if provided
      const deadline = dto.deadline ? new Date(dto.deadline) : undefined;

      // Upload document to S3 if file is provided
      let documentUrl: string | undefined;
      let documentFilename: string | undefined;

      if (req.file) {
        const uploadResult = await UploadService.handleTaskDocumentUpload(req.file as unknown as UploadedFile, this.s3Service, 'document');
        documentUrl = uploadResult.url; // This is the S3 key
        documentFilename = uploadResult.filename;
      }

      const task = await this.updateTechnicalTaskUseCase.execute({
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

      // Generate signed URLs for documents
      let taskWithSignedUrl = { ...task };
      if (task.documentUrl) {
        const signedUrl = await this.fileUrlService.getSignedUrl(task.documentUrl);
        taskWithSignedUrl = {
          ...taskWithSignedUrl,
          documentUrl: signedUrl,
        };
      }
      if (task.submissionUrl) {
        const submissionSignedUrl = await this.fileUrlService.getSignedUrl(task.submissionUrl);
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

      const tasks = await this.getTechnicalTasksByApplicationUseCase.execute(applicationId);

      // Generate signed URLs for all tasks
      const tasksWithSignedUrls = await Promise.all(
        tasks.map(async (task) => {
          const taskObj: typeof task & { documentUrl?: string; submissionUrl?: string } = { ...task };
          
          if (task.documentUrl) {
            taskObj.documentUrl = await this.fileUrlService.getSignedUrl(task.documentUrl);
          }
          
          if (task.submissionUrl) {
            taskObj.submissionUrl = await this.fileUrlService.getSignedUrl(task.submissionUrl);
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
      const userId = req.user?.id;
      const userName = req.user?.email || 'Unknown User';

      if (!userId) {
        sendInternalServerErrorResponse(res, 'User not authenticated');
        return;
      }

      await this.deleteTechnicalTaskUseCase.execute({
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



