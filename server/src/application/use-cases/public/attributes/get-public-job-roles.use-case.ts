import { IJobRoleRepository } from 'src/domain/interfaces/repositories/job-role/IJobRoleRepository';
import { IGetPublicJobRolesUseCase } from 'src/domain/interfaces/use-cases/public/attributes/IGetPublicJobRolesUseCase';

export class GetPublicJobRolesUseCase implements IGetPublicJobRolesUseCase {
  constructor(private readonly _jobRoleRepository: IJobRoleRepository) { }

  async execute(search: string = '', limit: number = 1000): Promise<string[]> {
    const filter: Record<string, unknown> = {};

    if (search && search.trim()) {
      filter.name = { $regex: search.trim(), $options: 'i' };
    }

    const result = await this._jobRoleRepository.paginate(filter, {
      page: 1,
      limit: limit,
      sortBy: 'name',
      sortOrder: 'asc',
    });

    return result.data.map((role) => role.name);
  }
}
