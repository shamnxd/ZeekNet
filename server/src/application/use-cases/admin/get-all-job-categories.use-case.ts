import { IJobCategoryRepository, JobCategoryQueryFilters } from '../../../domain/interfaces/repositories/IJobCategoryRepository';
import { PaginatedJobCategories, IGetAllJobCategoriesUseCase } from '../../../domain/interfaces/use-cases/IJobCategoryUseCases';

export class GetAllJobCategoriesUseCase implements IGetAllJobCategoriesUseCase {
  constructor(private readonly _jobCategoryRepository: IJobCategoryRepository) {}

  async execute(options: { page?: number; limit?: number; search?: string }): Promise<PaginatedJobCategories> {
    const filters: JobCategoryQueryFilters = {
      page: options.page,
      limit: options.limit,
      search: options.search,
      sortBy: 'name',
      sortOrder: 'asc',
    };

    return await this._jobCategoryRepository.findAllWithPagination(filters);
  }
}
