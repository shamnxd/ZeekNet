import { IJobApplicationRepository } from '../../../domain/interfaces/repositories/job-application/IJobApplicationRepository';
import { IGetSeekerApplicationDetailsUseCase } from '../../../domain/interfaces/use-cases/IJobApplicationUseCases';
import { NotFoundError, ValidationError } from '../../../domain/errors/errors';
import { JobApplication } from '../../../domain/entities/job-application.entity';

export class GetSeekerApplicationDetailsUseCase implements IGetSeekerApplicationDetailsUseCase {
  constructor(private readonly _jobApplicationRepository: IJobApplicationRepository) {}

  async execute(seekerId: string, applicationId: string): Promise<JobApplication> {
    const application = await this._jobApplicationRepository.findById(applicationId);
    if (!application) {
      throw new NotFoundError('Application not found');
    }

    if (application.seeker_id !== seekerId) {
      throw new ValidationError('You can only view your own applications');
    }

    return application;
  }
}



