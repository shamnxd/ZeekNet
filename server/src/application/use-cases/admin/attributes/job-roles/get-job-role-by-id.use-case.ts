import { IJobRoleRepository } from 'src/domain/interfaces/repositories/job-role/IJobRoleRepository';
import { JobRole } from 'src/domain/entities/job-role.entity';
import { IGetJobRoleByIdUseCase } from 'src/domain/interfaces/use-cases/admin/attributes/job-roles/IGetJobRoleByIdUseCase';
import { NotFoundError } from 'src/domain/errors/errors';
import { JobRoleResponseDto } from 'src/application/dtos/admin/attributes/job-roles/responses/job-role-response.dto';
import { JobRoleMapper } from 'src/application/mappers/job/job-role.mapper';
import { injectable, inject } from 'inversify';
import { TYPES } from 'src/shared/constants/types';
import { ERROR } from 'src/shared/constants/messages';


@injectable()
export class GetJobRoleByIdUseCase implements IGetJobRoleByIdUseCase {
  constructor(@inject(TYPES.JobRoleRepository) private readonly _jobRoleRepository: IJobRoleRepository) {}

  async execute(jobRoleId: string): Promise<JobRoleResponseDto> {
    const jobRole = await this._jobRoleRepository.findById(jobRoleId);
    
    if (!jobRole) {
      throw new NotFoundError(ERROR.NOT_FOUND('Job role'));
    }

    return JobRoleMapper.toResponse(jobRole);
  }
}

