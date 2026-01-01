import { IJobRoleRepository } from 'src/domain/interfaces/repositories/job-role/IJobRoleRepository';
import { JobRole } from 'src/domain/entities/job-role.entity';
import { BadRequestError, ConflictError } from 'src/domain/errors/errors';
import { ICreateJobRoleUseCase } from 'src/domain/interfaces/use-cases/admin/attributes/job-roles/ICreateJobRoleUseCase';
import { CreateInput } from 'src/domain/types/common.types';

export class CreateJobRoleUseCase implements ICreateJobRoleUseCase {
  constructor(private readonly _jobRoleRepository: IJobRoleRepository) {}

  async execute(name: string): Promise<JobRole> {
    if (!name || !name.trim()) {
      throw new BadRequestError('Job role name is required');
    }

    const normalizedName = name.trim();
    const existingJobRole = await this._jobRoleRepository.findByName(normalizedName);
    
    if (existingJobRole) {
      throw new ConflictError('Job role with this name already exists');
    }

    return await this._jobRoleRepository.create({ name: normalizedName } as CreateInput<JobRole>);
  }
}

