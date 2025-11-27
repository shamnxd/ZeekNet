import { IJobCategoryRepository } from '../../../domain/interfaces/repositories/IJobCategoryRepository';
import { IGetPublicJobCategoriesUseCase } from '../../../domain/interfaces/use-cases/IPublicUseCases';

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
