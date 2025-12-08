import { IJobRoleRepository } from '../../../domain/interfaces/repositories/job-role/IJobRoleRepository';
import { IDeleteJobRoleUseCase } from '../../../domain/interfaces/use-cases/admin/IAdminUseCases';
import { AppError } from '../../../domain/errors/errors';

export class DeleteJobRoleUseCase implements IDeleteJobRoleUseCase {
  constructor(private readonly _jobRoleRepository: IJobRoleRepository) {}

  async execute(jobRoleId: string): Promise<boolean> {
    const jobRole = await this._jobRoleRepository.findById(jobRoleId);
    
    if (!jobRole) {
      throw new AppError('Job role not found', 404);
    }

    const deleted = await this._jobRoleRepository.delete(jobRoleId);
    
    if (!deleted) {
      throw new AppError('Failed to delete job role', 500);
    }

    return true;
  }
}

