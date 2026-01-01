import { IJobCategoryRepository } from 'src/domain/interfaces/repositories/job-category/IJobCategoryRepository';
import { JobCategory } from 'src/domain/entities/job-category.entity';
import { NotFoundError } from 'src/domain/errors/errors';
import { IGetJobCategoryByIdUseCase } from 'src/domain/interfaces/use-cases/admin/attributes/job-categorys/IGetJobCategoryByIdUseCase';

export class GetJobCategoryByIdUseCase implements IGetJobCategoryByIdUseCase {
  constructor(private readonly _jobCategoryRepository: IJobCategoryRepository) {}

  async execute(id: string): Promise<JobCategory> {
    const category = await this._jobCategoryRepository.findById(id);
    
    if (!category) {
      throw new NotFoundError('Category not found');
    }

    return category;
  }
}
