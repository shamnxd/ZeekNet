import { IJobRoleRepository } from '../../../domain/interfaces/repositories/job-role/IJobRoleRepository';
import { IGetAllJobRolesUseCase } from 'src/domain/interfaces/use-cases/job-roles/IGetAllJobRolesUseCase';
import { PaginatedJobRolesResultDto } from '../../dto/job-roles/paginated-job-roles-result.dto';

export class GetAllJobRolesUseCase implements IGetAllJobRolesUseCase {
  constructor(private readonly _jobRoleRepository: IJobRoleRepository) {}

  async execute(options: { page?: number; limit?: number; search?: string }): Promise<PaginatedJobRolesResultDto> {
    const query: Record<string, unknown> = {};
    if (options.search) {
      query.name = { $regex: options.search, $options: 'i' };
    }

    const result = await this._jobRoleRepository.paginate(query, {
      page: options.page,
      limit: options.limit,
      sortBy: 'name',
      sortOrder: 'asc',
    });

    return {
      jobRoles: result.data.map((role) => ({
        id: role.id,
        name: role.name,
        createdAt: role.createdAt,
        updatedAt: role.updatedAt,
      })),
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    };
  }
}

