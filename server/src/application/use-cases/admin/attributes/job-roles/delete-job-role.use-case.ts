import { IJobRoleRepository } from 'src/domain/interfaces/repositories/job-role/IJobRoleRepository';
import { IDeleteJobRoleUseCase } from 'src/domain/interfaces/use-cases/admin/attributes/job-roles/IDeleteJobRoleUseCase';
import { NotFoundError, InternalServerError } from 'src/domain/errors/errors';
import { injectable, inject } from 'inversify';
import { TYPES } from 'src/shared/constants/types';
import { ERROR } from 'src/shared/constants/messages';


@injectable()
export class DeleteJobRoleUseCase implements IDeleteJobRoleUseCase {
  constructor(@inject(TYPES.JobRoleRepository) private readonly _jobRoleRepository: IJobRoleRepository) {}

  async execute(jobRoleId: string): Promise<boolean> {
    const jobRole = await this._jobRoleRepository.findById(jobRoleId);
    
    if (!jobRole) {
      throw new NotFoundError(ERROR.NOT_FOUND('Job role'));
    }

    const deleted = await this._jobRoleRepository.delete(jobRoleId);
    
    if (!deleted) {
      throw new InternalServerError(ERROR.FAILED_TO('delete job role'));
    }

    return true;
  }
}

