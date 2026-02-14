import { IUpdateTechnicalTaskUseCase } from 'src/domain/interfaces/use-cases/application/task/IUpdateTechnicalTaskUseCase';
import { IATSTechnicalTaskRepository } from 'src/domain/interfaces/repositories/ats/IATSTechnicalTaskRepository';
import { NotFoundError, BadRequestError } from 'src/domain/errors/errors';
import { UpdateTechnicalTaskRequestDto } from 'src/application/dtos/application/task/requests/update-technical-task.dto';
import { ATSTechnicalTaskResponseDto } from 'src/application/dtos/application/task/responses/ats-technical-task-response.dto';
import { ATSTechnicalTaskMapper } from 'src/application/mappers/ats/ats-technical-task.mapper';
import { IS3Service } from 'src/domain/interfaces/services/IS3Service';
import { IFileUploadService } from 'src/domain/interfaces/services/IFileUploadService';
import { UploadedFile } from 'src/domain/types/common.types';

export class UpdateTechnicalTaskUseCase implements IUpdateTechnicalTaskUseCase {
  constructor(
    private readonly _technicalTaskRepository: IATSTechnicalTaskRepository,
    private readonly _fileUploadService: IFileUploadService,
    private readonly _s3Service: IS3Service,
  ) { }

  async execute(dto: UpdateTechnicalTaskRequestDto, file?: UploadedFile): Promise<ATSTechnicalTaskResponseDto> {

    const existingTask = await this._technicalTaskRepository.findById(dto.taskId);
    if (!existingTask) {
      throw new NotFoundError('Technical task not found');
    }

    if (existingTask.status === 'cancelled' && dto.status === 'completed') {
      throw new BadRequestError('Cannot mark a cancelled task as completed');
    }

    if (existingTask.status === 'completed' && dto.status === 'cancelled') {
      throw new BadRequestError('Cannot cancel a completed task');
    }

    if (existingTask.status === 'under_review' && dto.status === 'cancelled') {
      throw new BadRequestError('Cannot cancel a task that is already under review');
    }

    if (dto.rating !== undefined && existingTask.rating !== undefined) {
      throw new BadRequestError('Technical task rating has already been submitted');
    }

    if (dto.feedback !== undefined && existingTask.feedback !== undefined) {
      throw new BadRequestError('Technical task feedback has already been submitted');
    }

    let { documentUrl, documentFilename } = dto;

    if (file) {
      const uploadResult = await this._fileUploadService.uploadTaskDocument(file);
      documentUrl = uploadResult.url;
      documentFilename = uploadResult.filename;
    }

    const updateData: {
      title?: string;
      description?: string;
      deadline?: Date;
      documentUrl?: string;
      documentFilename?: string;
      submissionUrl?: string;
      submissionFilename?: string;
      status?: 'assigned' | 'submitted' | 'under_review' | 'completed' | 'cancelled';
      rating?: number;
      feedback?: string;
    } = {};
    if (dto.title !== undefined) updateData.title = dto.title;
    if (dto.description !== undefined) updateData.description = dto.description;
    if (dto.deadline !== undefined) updateData.deadline = dto.deadline;
    if (documentUrl !== undefined) updateData.documentUrl = documentUrl;
    if (documentFilename !== undefined) updateData.documentFilename = documentFilename;
    if (dto.submissionUrl !== undefined) updateData.submissionUrl = dto.submissionUrl;
    if (dto.submissionFilename !== undefined) updateData.submissionFilename = dto.submissionFilename;
    if (dto.status !== undefined) updateData.status = dto.status;
    if (dto.rating !== undefined) updateData.rating = dto.rating;
    if (dto.feedback !== undefined) updateData.feedback = dto.feedback;

    const task = await this._technicalTaskRepository.update(dto.taskId, updateData);

    if (!task) {
      throw new NotFoundError('Technical task not found');
    }

    const response = ATSTechnicalTaskMapper.toResponse(task);

    if (response.documentUrl && !response.documentUrl.startsWith('http')) {
      response.documentUrl = await this._s3Service.getSignedUrl(response.documentUrl);
    }

    if (response.submissionUrl && !response.submissionUrl.startsWith('http')) {
      response.submissionUrl = await this._s3Service.getSignedUrl(response.submissionUrl);
    }

    return response;
  }
}
