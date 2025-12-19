import { IJobRoleRepository } from '../../../domain/interfaces/repositories/job-role/IJobRoleRepository';
import { JobRole } from '../../../domain/entities/job-role.entity';
import { IGetJobRoleByIdUseCase } from 'src/domain/interfaces/use-cases/job-roles/IGetJobRoleByIdUseCase';
import { NotFoundError } from '../../../domain/errors/errors';

export class GetJobRoleByIdUseCase implements IGetJobRoleByIdUseCase {
  constructor(private readonly _jobRoleRepository: IJobRoleRepository) {}

  async execute(jobRoleId: string): Promise<JobRole> {
    const jobRole = await this._jobRoleRepository.findById(jobRoleId);
    
    if (!jobRole) {
      throw new NotFoundError('Job role not found');
    }

    return jobRole;
  }
}

