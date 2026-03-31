import { IGetTechnicalTasksByApplicationUseCase } from 'src/domain/interfaces/use-cases/application/task/IGetTechnicalTasksByApplicationUseCase';
import { IATSTechnicalTaskRepository } from 'src/domain/interfaces/repositories/ats/IATSTechnicalTaskRepository';
import { ATSTechnicalTaskResponseDto } from 'src/application/dtos/application/task/responses/ats-technical-task-response.dto';
import { ATSTechnicalTaskMapper } from 'src/application/mappers/ats/ats-technical-task.mapper';
import { IS3Service } from 'src/domain/interfaces/services/IS3Service';

export class GetTechnicalTasksByApplicationUseCase implements IGetTechnicalTasksByApplicationUseCase {
  constructor(
    private readonly technicalTaskRepository: IATSTechnicalTaskRepository,
    private readonly _s3Service: IS3Service,
  ) { }

  async execute(applicationId: string): Promise<ATSTechnicalTaskResponseDto[]> {
    const tasks = await this.technicalTaskRepository.findByApplicationId(applicationId);

    return Promise.all(
      tasks.map(async (task) => {
        const response = ATSTechnicalTaskMapper.toResponse(task);

        if (task.documentUrl && !task.documentUrl.startsWith('http')) {
          response.documentUrl = await this._s3Service.getSignedUrl(task.documentUrl);
        }

        if (task.submissionUrl && !task.submissionUrl.startsWith('http')) {
          response.submissionUrl = await this._s3Service.getSignedUrl(task.submissionUrl);
        }

        return response;
      }),
    );
  }
}

