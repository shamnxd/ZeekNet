import { IJobApplicationRepository } from '../../../domain/interfaces/repositories/job-application/IJobApplicationRepository';
import { IATSTechnicalTaskRepository } from '../../../domain/interfaces/repositories/ats/IATSTechnicalTaskRepository';
import { IS3Service } from '../../../domain/interfaces/services/IS3Service';
import { NotFoundError, AuthorizationError } from '../../../domain/errors/errors';
import { 
  TechnicalTaskForSeekerDto, 
  IGetTechnicalTasksByApplicationUseCase 
} from '../../../domain/interfaces/use-cases/applications/IGetTechnicalTasksByApplicationUseCase';

export class GetTechnicalTasksByApplicationUseCase implements IGetTechnicalTasksByApplicationUseCase {
  constructor(
    private readonly _jobApplicationRepository: IJobApplicationRepository,
    private readonly _technicalTaskRepository: IATSTechnicalTaskRepository,
    private readonly _s3Service: IS3Service,
  ) {}

  async execute(userId: string, applicationId: string): Promise<TechnicalTaskForSeekerDto[]> {
    const application = await this._jobApplicationRepository.findById(applicationId);
    
    if (!application) {
      throw new NotFoundError('Application not found');
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
