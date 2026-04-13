import { IJobApplicationRepository } from 'src/domain/interfaces/repositories/job-application/IJobApplicationRepository';
import { IATSTechnicalTaskRepository } from 'src/domain/interfaces/repositories/ats/IATSTechnicalTaskRepository';
import { IS3Service } from 'src/domain/interfaces/services/IS3Service';
import { NotFoundError, AuthorizationError } from 'src/domain/errors/errors';
import { 
  TechnicalTaskForSeekerDto, 
  IGetTechnicalTasksByApplicationUseCase, 
} from 'src/domain/interfaces/use-cases/seeker/applications/IGetTechnicalTasksByApplicationUseCase';

import { injectable, inject } from 'inversify';
import { TYPES } from 'src/shared/constants/types';
import { ERROR } from 'src/shared/constants/messages';

@injectable()
export class GetTechnicalTasksByApplicationUseCase implements IGetTechnicalTasksByApplicationUseCase {
  constructor(
    @inject(TYPES.JobApplicationRepository) private readonly _jobApplicationRepository: IJobApplicationRepository,
    @inject(TYPES.ATSTechnicalTaskRepository) private readonly _technicalTaskRepository: IATSTechnicalTaskRepository,
    @inject(TYPES.S3Service) private readonly _s3Service: IS3Service,
  ) {}

  async execute(userId: string, applicationId: string): Promise<TechnicalTaskForSeekerDto[]> {
    const application = await this._jobApplicationRepository.findById(applicationId);
    
    if (!application) {
      throw new NotFoundError(ERROR.NOT_FOUND('Application'));
    }

    if (application.seekerId !== userId) {
      throw new AuthorizationError('You can only view your own applications');
    }

    const tasks = await this._technicalTaskRepository.findByApplicationId(applicationId);
    
    return Promise.all(
      tasks.map(async (task) => {
        const taskDto: TechnicalTaskForSeekerDto = {
          id: task.id,
          applicationId: task.applicationId,
          title: task.title,
          description: task.description,
          deadline: task.deadline,
          documentFilename: task.documentFilename,
          submissionFilename: task.submissionFilename,
          submissionLink: task.submissionLink,
          submissionNote: task.submissionNote,
          submittedAt: task.submittedAt,
          status: task.status,
          createdAt: task.createdAt,
          updatedAt: task.updatedAt,
        };
        
        if (task.documentUrl) {
          taskDto.documentUrl = await this._s3Service.getSignedUrl(task.documentUrl);
        }
        
        if (task.submissionUrl) {
          taskDto.submissionUrl = await this._s3Service.getSignedUrl(task.submissionUrl);
        }
        
        return taskDto;
      }),
    );
  }
}
