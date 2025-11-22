import { IJobRoleRepository } from '../../../domain/interfaces/repositories/job-role/IJobRoleRepository';
import { JobRole } from '../../../domain/entities/job-role.entity';
import { ICreateJobRoleUseCase } from '../../../domain/interfaces/use-cases/IAdminUseCases';
import { AppError } from '../../../domain/errors/errors';

export class CreateJobRoleUseCase implements ICreateJobRoleUseCase {
  constructor(private readonly _jobRoleRepository: IJobRoleRepository) {}

  async execute(name: string): Promise<JobRole> {
    if (!name || !name.trim()) {
      throw new AppError('Job role name is required', 400);
    }

    const normalizedName = name.trim();
    const existingJobRole = await this._jobRoleRepository.findByName(normalizedName);
    
    if (existingJobRole) {
      throw new AppError('Job role with this name already exists', 409);
    }

    return await this._jobRoleRepository.create({ name: normalizedName } as Omit<JobRole, 'id' | '_id' | 'createdAt' | 'updatedAt'>);
  }
}

