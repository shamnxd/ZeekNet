import { IJobRoleRepository } from '../../../domain/interfaces/repositories/job-role/IJobRoleRepository';
import { PaginatedJobRoles, IGetAllJobRolesUseCase } from '../../../domain/interfaces/use-cases/IAdminUseCases';

export class GetAllJobRolesUseCase implements IGetAllJobRolesUseCase {
  constructor(private readonly _jobRoleRepository: IJobRoleRepository) {}

  async execute(options: { page?: number; limit?: number; search?: string }): Promise<PaginatedJobRoles> {
    const query: Record<string, unknown> = {};
    if (options.search) {
      query.name = { $regex: options.search, $options: 'i' };
    }

    return await this._jobRoleRepository.paginate(query, {
      page: options.page,
      limit: options.limit,
      sortBy: 'name',
      sortOrder: 'asc',
    });
  }
}

