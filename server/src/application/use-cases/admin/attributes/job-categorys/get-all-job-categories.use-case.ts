import { IGetAllJobCategoriesUseCase } from 'src/domain/interfaces/use-cases/admin/attributes/job-categorys/IGetAllJobCategoriesUseCase';
import { IJobCategoryRepository } from 'src/domain/interfaces/repositories/job-category/IJobCategoryRepository';
import { PaginatedJobCategoriesResultDto } from 'src/application/dtos/admin/attributes/job-categorys/responses/paginated-job-categories-result.dto';
import { JobCategoryMapper } from 'src/application/mappers/job/job-category.mapper';

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


