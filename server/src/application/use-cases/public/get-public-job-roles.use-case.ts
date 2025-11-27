import { IJobRoleRepository } from '../../../domain/interfaces/repositories/job-role/IJobRoleRepository';
import { IGetPublicJobRolesUseCase } from '../../../domain/interfaces/use-cases/IPublicUseCases';

export class GetPublicJobRolesUseCase implements IGetPublicJobRolesUseCase {
  constructor(private readonly _jobRoleRepository: IJobRoleRepository) {}

  async execute(): Promise<string[]> {
    const result = await this._jobRoleRepository.paginate({}, {
      page: 1,
      limit: 1000,
      sortBy: 'name',
      sortOrder: 'asc',
    });

    // Return only job role names as a simple array
    return result.data.map((role) => role.name);
  }
}
