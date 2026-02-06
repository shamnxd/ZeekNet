import { IUpdateTechnicalTaskUseCase } from 'src/domain/interfaces/use-cases/application/task/IUpdateTechnicalTaskUseCase';
import { IATSTechnicalTaskRepository } from 'src/domain/interfaces/repositories/ats/IATSTechnicalTaskRepository';
import { IJobApplicationRepository } from 'src/domain/interfaces/repositories/job-application/IJobApplicationRepository';

import { ATSTechnicalTask } from 'src/domain/entities/ats-technical-task.entity';
import { NotFoundError }
  from 'src/domain/errors/errors';
import { IUserRepository } from 'src/domain/interfaces/repositories/user/IUserRepository';
import { UpdateTechnicalTaskRequestDto } from 'src/application/dtos/application/task/requests/update-technical-task.dto';
import { ATSTechnicalTaskResponseDto } from 'src/application/dtos/application/task/responses/ats-technical-task-response.dto';
import { ATSTechnicalTaskMapper } from 'src/application/mappers/ats/ats-technical-task.mapper';

export class UpdateTechnicalTaskUseCase implements IUpdateTechnicalTaskUseCase {
  constructor(
    private readonly _technicalTaskRepository: IATSTechnicalTaskRepository,
    private readonly _jobApplicationRepository: IJobApplicationRepository,

    private readonly _userRepository: IUserRepository,
  ) { }

  async execute(dto: UpdateTechnicalTaskRequestDto): Promise<ATSTechnicalTaskResponseDto> {

    const existingTask = await this._technicalTaskRepository.findById(dto.taskId);
    if (!existingTask) {
      throw new NotFoundError('Technical task not found');
    }

    const currentUser = await this._userRepository.findById(dto.performedBy);
    const performedByName = currentUser ? currentUser.name : 'Unknown';

    const updateData: {
      title?: string;
      description?: string;
      deadline?: Date;
      documentUrl?: string;
      documentFilename?: string;
      submissionUrl?: string;
      submissionFilename?: string;
      status?: 'assigned' | 'submitted' | 'under_review' | 'completed' | 'cancelled';
      score?: number;
      feedback?: string;
    } = {};
    if (dto.title !== undefined) updateData.title = dto.title;
    if (dto.description !== undefined) updateData.description = dto.description;
    if (dto.deadline !== undefined) updateData.deadline = dto.deadline;
    if (dto.documentUrl !== undefined) updateData.documentUrl = dto.documentUrl;
    if (dto.documentFilename !== undefined) updateData.documentFilename = dto.documentFilename;
    if (dto.submissionUrl !== undefined) updateData.submissionUrl = dto.submissionUrl;
    if (dto.submissionFilename !== undefined) updateData.submissionFilename = dto.submissionFilename;
    if (dto.status !== undefined) updateData.status = dto.status;
    if (dto.rating !== undefined) updateData.score = dto.rating; // Map rating to score? Entity has score. DTO has rating.
    if (dto.feedback !== undefined) updateData.feedback = dto.feedback;

    const task = await this._technicalTaskRepository.update(dto.taskId, updateData);

    if (!task) {
      throw new NotFoundError('Technical task not found');
    }


    const application = await this._jobApplicationRepository.findById(existingTask.applicationId);
    if (application) {

    }

    return ATSTechnicalTaskMapper.toResponse(task);
  }
}
