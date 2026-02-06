import { IDeleteTechnicalTaskUseCase } from 'src/domain/interfaces/use-cases/application/task/IDeleteTechnicalTaskUseCase';
import { IATSTechnicalTaskRepository } from 'src/domain/interfaces/repositories/ats/IATSTechnicalTaskRepository';
import { IJobApplicationRepository } from 'src/domain/interfaces/repositories/job-application/IJobApplicationRepository';

import { NotFoundError } from 'src/domain/errors/errors';
import { DeleteTechnicalTaskRequestDto } from 'src/application/dtos/application/task/requests/delete-technical-task.dto';

export class DeleteTechnicalTaskUseCase implements IDeleteTechnicalTaskUseCase {
  constructor(
    private technicalTaskRepository: IATSTechnicalTaskRepository,
    private jobApplicationRepository: IJobApplicationRepository,

  ) { }

  async execute(data: DeleteTechnicalTaskRequestDto): Promise<void> {

    const existingTask = await this.technicalTaskRepository.findById(data.taskId);
    if (!existingTask) {
      throw new NotFoundError('Technical task not found');
    }

    const deleted = await this.technicalTaskRepository.delete(data.taskId);
    if (!deleted) {
      throw new NotFoundError('Technical task not found');
    }


    const application = await this.jobApplicationRepository.findById(existingTask.applicationId);
    if (application) {

    }
  }
}

