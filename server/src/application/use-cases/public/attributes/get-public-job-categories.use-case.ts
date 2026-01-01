import { IJobCategoryRepository } from 'src/domain/interfaces/repositories/job-category/IJobCategoryRepository';
import { IGetPublicJobCategoriesUseCase } from 'src/domain/interfaces/use-cases/public/attributes/IGetPublicJobCategoriesUseCase';

export class GetPublicJobCategoriesUseCase implements IGetPublicJobCategoriesUseCase {
  constructor(private readonly _jobCategoryRepository: IJobCategoryRepository) {}

  async execute(): Promise<string[]> {
    const result = await this._jobCategoryRepository.paginate({}, {
      page: 1,
      limit: 1000,
      sortBy: 'name',
      sortOrder: 'asc',
    });

    return result.data.map((category) => category.name);
  }
}
