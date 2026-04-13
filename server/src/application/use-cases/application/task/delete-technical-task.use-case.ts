import { injectable, inject } from 'inversify';
import { TYPES } from 'src/shared/constants/types';
import { ERROR } from 'src/shared/constants/messages';
import { IDeleteTechnicalTaskUseCase } from 'src/domain/interfaces/use-cases/application/task/IDeleteTechnicalTaskUseCase';
import { IATSTechnicalTaskRepository } from 'src/domain/interfaces/repositories/ats/IATSTechnicalTaskRepository';
import { IJobApplicationRepository } from 'src/domain/interfaces/repositories/job-application/IJobApplicationRepository';

import { NotFoundError } from 'src/domain/errors/errors';
import { DeleteTechnicalTaskRequestDto } from 'src/application/dtos/application/task/requests/delete-technical-task.dto';

@injectable()
export class DeleteTechnicalTaskUseCase implements IDeleteTechnicalTaskUseCase {
  constructor(
    @inject(TYPES.ATSTechnicalTaskRepository) private technicalTaskRepository: IATSTechnicalTaskRepository,
    @inject(TYPES.JobApplicationRepository) private jobApplicationRepository: IJobApplicationRepository,
  ) { }

  async execute(data: DeleteTechnicalTaskRequestDto): Promise<void> {

    const existingTask = await this.technicalTaskRepository.findById(data.taskId);
    if (!existingTask) {
      throw new NotFoundError(ERROR.NOT_FOUND('Technical task'));
    }

    const deleted = await this.technicalTaskRepository.delete(data.taskId);
    if (!deleted) {
      throw new NotFoundError(ERROR.NOT_FOUND('Technical task'));
    }

    const application = await this.jobApplicationRepository.findById(existingTask.applicationId);
    if (application) {
      // Logic for application update if needed
    }
  }
}
