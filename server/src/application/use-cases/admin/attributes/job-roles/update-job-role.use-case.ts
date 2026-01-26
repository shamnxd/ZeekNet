import { IJobRoleRepository } from 'src/domain/interfaces/repositories/job-role/IJobRoleRepository';
import { JobRole } from 'src/domain/entities/job-role.entity';
import { IUpdateJobRoleUseCase } from 'src/domain/interfaces/use-cases/admin/attributes/job-roles/IUpdateJobRoleUseCase';
import { BadRequestError, ConflictError, InternalServerError, NotFoundError } from 'src/domain/errors/errors';
import { UpdateJobRoleRequestDto } from 'src/application/dtos/admin/attributes/job-roles/requests/update-job-role-request.dto';
import { JobRoleResponseDto } from 'src/application/dtos/admin/attributes/job-roles/responses/job-role-response.dto';
import { JobRoleMapper } from 'src/application/mappers/job/job-role.mapper';

export class UpdateJobRoleUseCase implements IUpdateJobRoleUseCase {
  constructor(private readonly _jobRoleRepository: IJobRoleRepository) { }

  async execute(jobRoleId: string, dto: UpdateJobRoleRequestDto): Promise<JobRoleResponseDto> {
    const { name } = dto;

    if (!name || !name.trim()) {
      throw new BadRequestError('Job role name is required');
    }

    const normalizedName = name.trim();
    const existingJobRole = await this._jobRoleRepository.findById(jobRoleId);

    if (!existingJobRole) {
      throw new NotFoundError('Job role not found');
    }

    const jobRoleWithSameName = await this._jobRoleRepository.findByName(normalizedName);

    if (jobRoleWithSameName && jobRoleWithSameName.id !== jobRoleId) {
      throw new ConflictError('Job role with this name already exists');
    }

    const updatedJobRole = await this._jobRoleRepository.update(jobRoleId, { name: normalizedName });

    if (!updatedJobRole) {
      throw new InternalServerError('Failed to update job role');
    }

    return JobRoleMapper.toResponse(updatedJobRole);
  }
}

