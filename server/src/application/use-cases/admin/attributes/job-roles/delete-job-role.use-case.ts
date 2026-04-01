import { IJobRoleRepository } from 'src/domain/interfaces/repositories/job-role/IJobRoleRepository';
import { IDeleteJobRoleUseCase } from 'src/domain/interfaces/use-cases/admin/attributes/job-roles/IDeleteJobRoleUseCase';
import { NotFoundError, InternalServerError } from 'src/domain/errors/errors';
import { injectable, inject } from 'inversify';
import { TYPES } from 'src/shared/constants/types';

@injectable()
export class DeleteJobRoleUseCase implements IDeleteJobRoleUseCase {
  constructor(@inject(TYPES.JobRoleRepository) private readonly _jobRoleRepository: IJobRoleRepository) {}

  async execute(jobRoleId: string): Promise<boolean> {
    const jobRole = await this._jobRoleRepository.findById(jobRoleId);
    
    if (!jobRole) {
      throw new NotFoundError('Job role not found');
    }

    const deleted = await this._jobRoleRepository.delete(jobRoleId);
    
    if (!deleted) {
      throw new InternalServerError('Failed to delete job role');
    }

    return true;
  }
}

