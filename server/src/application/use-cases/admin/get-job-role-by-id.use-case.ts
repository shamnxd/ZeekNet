import { IJobRoleRepository } from '../../../domain/interfaces/repositories/job-role/IJobRoleRepository';
import { JobRole } from '../../../domain/entities/job-role.entity';
import { IGetJobRoleByIdUseCase } from 'src/domain/interfaces/use-cases/admin/IGetJobRoleByIdUseCase';
import { AppError } from '../../../domain/errors/errors';

export class GetJobRoleByIdUseCase implements IGetJobRoleByIdUseCase {
  constructor(private readonly _jobRoleRepository: IJobRoleRepository) {}

  async execute(jobRoleId: string): Promise<JobRole> {
    const jobRole = await this._jobRoleRepository.findById(jobRoleId);
    
    if (!jobRole) {
      throw new AppError('Job role not found', 404);
    }

    return jobRole;
  }
}

