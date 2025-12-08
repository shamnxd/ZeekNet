import { IJobRoleRepository } from '../../../domain/interfaces/repositories/job-role/IJobRoleRepository';
import { JobRole } from '../../../domain/entities/job-role.entity';
import { IUpdateJobRoleUseCase } from '../../../domain/interfaces/use-cases/admin/IAdminUseCases';
import { AppError } from '../../../domain/errors/errors';

export class UpdateJobRoleUseCase implements IUpdateJobRoleUseCase {
  constructor(private readonly _jobRoleRepository: IJobRoleRepository) {}

  async execute(jobRoleId: string, name: string): Promise<JobRole> {
    if (!name || !name.trim()) {
      throw new AppError('Job role name is required', 400);
    }

    const normalizedName = name.trim();
    const existingJobRole = await this._jobRoleRepository.findById(jobRoleId);
    
    if (!existingJobRole) {
      throw new AppError('Job role not found', 404);
    }

    const jobRoleWithSameName = await this._jobRoleRepository.findByName(normalizedName);
    
    if (jobRoleWithSameName && jobRoleWithSameName.id !== jobRoleId) {
      throw new AppError('Job role with this name already exists', 409);
    }

    const updatedJobRole = await this._jobRoleRepository.update(jobRoleId, { name: normalizedName });
    
    if (!updatedJobRole) {
      throw new AppError('Failed to update job role', 500);
    }

    return updatedJobRole;
  }
}

