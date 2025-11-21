import { IJobCategoryRepository } from '../../../domain/interfaces/repositories/IJobCategoryRepository';
import { PaginatedJobCategories, IGetAllJobCategoriesUseCase } from '../../../domain/interfaces/use-cases/IJobCategoryUseCases';

export class GetAllJobCategoriesUseCase implements IGetAllJobCategoriesUseCase {
  constructor(private readonly _jobCategoryRepository: IJobCategoryRepository) {}

  async execute(options: { page?: number; limit?: number; search?: string }): Promise<PaginatedJobCategories> {
    const query: Record<string, unknown> = {};
    if (options.search) {
      query.name = { $regex: options.search, $options: 'i' };
    }

    return await this._jobCategoryRepository.paginate(query, {
      page: options.page,
      limit: options.limit,
      sortBy: 'name',
      sortOrder: 'asc',
    });
  }
}
