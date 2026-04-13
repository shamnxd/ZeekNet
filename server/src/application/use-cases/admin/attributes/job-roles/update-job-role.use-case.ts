import { IJobRoleRepository } from 'src/domain/interfaces/repositories/job-role/IJobRoleRepository';
import { JobRole } from 'src/domain/entities/job-role.entity';
import { IUpdateJobRoleUseCase } from 'src/domain/interfaces/use-cases/admin/attributes/job-roles/IUpdateJobRoleUseCase';
import { BadRequestError, ConflictError, InternalServerError, NotFoundError } from 'src/domain/errors/errors';
import { UpdateJobRoleRequestDto } from 'src/application/dtos/admin/attributes/job-roles/requests/update-job-role-request.dto';
import { JobRoleResponseDto } from 'src/application/dtos/admin/attributes/job-roles/responses/job-role-response.dto';
import { JobRoleMapper } from 'src/application/mappers/job/job-role.mapper';
import { injectable, inject } from 'inversify';
import { TYPES } from 'src/shared/constants/types';
import { ERROR, VALIDATION } from 'src/shared/constants/messages';


@injectable()
export class UpdateJobRoleUseCase implements IUpdateJobRoleUseCase {
  constructor(@inject(TYPES.JobRoleRepository) private readonly _jobRoleRepository: IJobRoleRepository) { }

  async execute(jobRoleId: string, dto: UpdateJobRoleRequestDto): Promise<JobRoleResponseDto> {
    const { name } = dto;

    if (!name || !name.trim()) {
      throw new BadRequestError(VALIDATION.REQUIRED('Job role name'));
    }

    const normalizedName = name.trim();
    const existingJobRole = await this._jobRoleRepository.findById(jobRoleId);

    if (!existingJobRole) {
      throw new NotFoundError(ERROR.NOT_FOUND('Job role'));
    }

    const jobRoleWithSameName = await this._jobRoleRepository.findByName(normalizedName);

    if (jobRoleWithSameName && jobRoleWithSameName.id !== jobRoleId) {
      throw new ConflictError(ERROR.ALREADY_EXISTS('Job role with this name'));
    }

    const updatedJobRole = await this._jobRoleRepository.update(jobRoleId, { name: normalizedName });

    if (!updatedJobRole) {
      throw new InternalServerError(ERROR.FAILED_TO('update job role'));
    }

    return JobRoleMapper.toResponse(updatedJobRole);
  }
}

