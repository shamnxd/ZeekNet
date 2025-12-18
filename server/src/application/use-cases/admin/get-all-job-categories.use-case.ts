import { IGetAllJobCategoriesUseCase } from 'src/domain/interfaces/use-cases/job-categories/IGetAllJobCategoriesUseCase';
import { IJobCategoryRepository } from '../../../domain/interfaces/repositories/IJobCategoryRepository';
import { PaginatedJobCategoriesResultDto } from '../../dto/job-categories/paginated-job-categories-result.dto';
import { JobCategoryMapper } from '../../mappers/job-category.mapper';

export class GetAllJobCategoriesUseCase implements IGetAllJobCategoriesUseCase {
  constructor(private readonly _jobCategoryRepository: IJobCategoryRepository) {}

  async execute(options: { page?: number; limit?: number; search?: string }): Promise<PaginatedJobCategoriesResultDto> {
    const query: Record<string, unknown> = {};
    if (options.search) {
      query.name = { $regex: options.search, $options: 'i' };
    }

    const result = await this._jobCategoryRepository.paginate(query, {
      page: options.page,
      limit: options.limit,
      sortBy: 'name',
      sortOrder: 'asc',
    });

    return {
      categories: JobCategoryMapper.toResponseList(result.data),
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    };
  }
}
